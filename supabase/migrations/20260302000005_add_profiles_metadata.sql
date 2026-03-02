-- Migration: Add metadata JSONB column to profiles for clinical notes and dental chart data
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
