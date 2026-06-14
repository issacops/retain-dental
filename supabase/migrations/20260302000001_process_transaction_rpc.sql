-- Migration: Add Secure Transaction Processing RPC

CREATE OR REPLACE FUNCTION public.process_transaction(
    p_clinic_id uuid,
    p_patient_id uuid,
    p_amount_paid numeric,
    p_category text,
    p_type text,
    p_description text DEFAULT NULL,
    p_care_plan_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_role text;
    v_caller_clinic uuid;
    v_loyalty_config jsonb;
    v_default_rate numeric;
    v_category_rate numeric;
    v_redemption_rate numeric;
    v_points_change numeric;
    v_wallet_id uuid;
    v_family_group_id uuid;
    v_current_balance numeric;
    v_required_points numeric;
    v_total_family_balance numeric;
    v_remaining_deduction numeric;
    v_wallet_row record;
    v_deduction numeric;
    v_new_spend numeric;
    v_current_tier text;
    v_new_tier text;
    v_final_description text;
BEGIN
    -- 1. Security Check: Only ADMINs of the specific clinic can process transactions
    SELECT role, clinic_id INTO v_role, v_caller_clinic FROM public.profiles WHERE id = auth.uid();
    
    IF v_role != 'ADMIN' OR v_caller_clinic != p_clinic_id THEN
        RAISE EXCEPTION 'Unauthorized: Only clinic admins can process transactions.';
    END IF;

    -- 2. Fetch Clinic Loyalty Config
    SELECT loyalty_config INTO v_loyalty_config FROM public.clinics WHERE id = p_clinic_id;
    
    v_default_rate := COALESCE((v_loyalty_config->>'defaultRate')::numeric, 10);
    v_category_rate := COALESCE((v_loyalty_config->'categoryRates'->>p_category)::numeric, v_default_rate);
    v_redemption_rate := COALESCE((v_loyalty_config->>'redemptionRate')::numeric, 1);

    -- 3. Calculate Points
    IF p_type = 'EARN' THEN
        v_points_change := FLOOR(p_amount_paid * (v_category_rate / 100));
    ELSIF p_type = 'REDEEM' THEN
        v_points_change := -(p_amount_paid * v_redemption_rate);
    ELSE
        RAISE EXCEPTION 'Invalid transaction type.';
    END IF;

    v_final_description := COALESCE(p_description, p_type || ' - ' || p_category);

    -- 4. Fetch User's Primary Wallet & Profile
    SELECT id, balance INTO v_wallet_id, v_current_balance FROM public.wallets WHERE user_id = p_patient_id LIMIT 1;
    IF v_wallet_id IS NULL THEN
        RAISE EXCEPTION 'Wallet not found for patient.';
    END IF;

    SELECT family_group_id, current_tier, COALESCE(lifetime_spend, 0) INTO v_family_group_id, v_current_tier, v_new_spend 
    FROM public.profiles WHERE id = p_patient_id;

    -- 5. Handle Redemption (Waterfall logic if insufficient personal funds)
    IF p_type = 'REDEEM' THEN
        v_required_points := ABS(v_points_change);

        IF v_current_balance < v_required_points THEN
            -- Check Family Pool
            IF v_family_group_id IS NULL THEN
                RAISE EXCEPTION 'Insufficient Points. Balance: %, Required: %', v_current_balance, v_required_points;
            END IF;

            SELECT COALESCE(SUM(balance), 0) INTO v_total_family_balance 
            FROM public.wallets 
            WHERE user_id IN (SELECT id FROM public.profiles WHERE family_group_id = v_family_group_id);

            IF v_total_family_balance < v_required_points THEN
                RAISE EXCEPTION 'Insufficient Household Points. Pool: %, Required: %', v_total_family_balance, v_required_points;
            END IF;

            -- Execute Waterfall Deduction
            v_remaining_deduction := v_required_points;

            -- First deduct from requester
            v_deduction := LEAST(v_current_balance, v_remaining_deduction);
            IF v_deduction > 0 THEN
                INSERT INTO public.transactions (clinic_id, wallet_id, amount_paid, points_earned, category, type, description, care_plan_id)
                VALUES (p_clinic_id, v_wallet_id, 0, -v_deduction, p_category, p_type, v_final_description || ' (Self)', p_care_plan_id);
                
                UPDATE public.wallets SET balance = balance - v_deduction, last_transaction_at = NOW() WHERE id = v_wallet_id;
                v_remaining_deduction := v_remaining_deduction - v_deduction;
            END IF;

            -- Then deduct from other family members
            FOR v_wallet_row IN 
                SELECT id, balance FROM public.wallets 
                WHERE user_id IN (SELECT id FROM public.profiles WHERE family_group_id = v_family_group_id)
                AND id != v_wallet_id
                ORDER BY balance DESC -- Drain richest wallets first
            LOOP
                EXIT WHEN v_remaining_deduction <= 0;
                
                IF v_wallet_row.balance > 0 THEN
                    v_deduction := LEAST(v_wallet_row.balance, v_remaining_deduction);
                    
                    INSERT INTO public.transactions (clinic_id, wallet_id, amount_paid, points_earned, category, type, description, care_plan_id)
                    VALUES (p_clinic_id, v_wallet_row.id, 0, -v_deduction, p_category, p_type, v_final_description || ' (Family Share)', p_care_plan_id);
                    
                    UPDATE public.wallets SET balance = balance - v_deduction, last_transaction_at = NOW() WHERE id = v_wallet_row.id;
                    v_remaining_deduction := v_remaining_deduction - v_deduction;
                END IF;
            END LOOP;

            RETURN json_build_object('success', true, 'message', 'Household Pool Redeemed Successfully');
        END IF;
    END IF;

    -- 6. Standard Processing (EARN or Sufficient Personal REDEEM)
    INSERT INTO public.transactions (clinic_id, wallet_id, amount_paid, points_earned, category, type, description, care_plan_id)
    VALUES (p_clinic_id, v_wallet_id, p_amount_paid, v_points_change, p_category, p_type, v_final_description, p_care_plan_id);
    
    UPDATE public.wallets SET balance = balance + v_points_change, last_transaction_at = NOW() WHERE id = v_wallet_id;

    -- 7. Lifetime Spend & Tier Upgrade (Only on EARN)
    IF p_type = 'EARN' THEN
        v_new_spend := v_new_spend + p_amount_paid;
        v_new_tier := v_current_tier;
        
        -- Default Thresholds (could be dynamic based on config, but hardcoded here for simplicity per the app's logic)
        IF v_new_spend >= 50000 THEN
            v_new_tier := 'PLATINUM';
        ELSIF v_new_spend >= 10000 THEN
            v_new_tier := 'GOLD';
        END IF;

        UPDATE public.profiles 
        SET lifetime_spend = v_new_spend, current_tier = v_new_tier 
        WHERE id = p_patient_id;
    END IF;

    RETURN json_build_object('success', true, 'message', 'Transaction Processed');
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'message', SQLERRM);
END;
$$;

