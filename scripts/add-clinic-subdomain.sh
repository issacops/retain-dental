#!/bin/bash
# Register a clinic subdomain on Cloudflare Pages
# Usage: ./scripts/add-clinic-subdomain.sh <clinic-slug>
# Example: ./scripts/add-clinic-subdomain.sh citydental

set -e

SLUG="${1:?Usage: $0 <clinic-slug>}"
CF_KEY="${CF_API_KEY:?Set CF_API_KEY env var}"
CF_EMAIL="${CF_API_EMAIL:?Set CF_API_EMAIL env var}"
ACCT="fe5ada0021bdf255f183c95184b5eb96"
ZONE="4d69d9139227318b62ae1a12218d7aa1"
DOMAIN="${SLUG}.app.retaindental.com"

echo "==> Registering ${DOMAIN}..."

# 1. Ensure DNS CNAME exists
echo "  [1/2] Creating DNS CNAME..."
curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records" \
  -H "X-Auth-Key: $CF_KEY" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "Content-Type: application/json" \
  -d "{\"type\":\"CNAME\",\"name\":\"${SLUG}.app\",\"content\":\"retaindental-app.pages.dev\",\"proxied\":true,\"ttl\":1}" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('  DNS:', 'OK' if d.get('success') else d.get('errors'))"

# 2. Add domain to Pages project
echo "  [2/2] Adding to Pages project..."
curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/$ACCT/pages/projects/retaindental-app/domains" \
  -H "X-Auth-Key: $CF_KEY" \
  -H "X-Auth-Email: $CF_EMAIL" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"${DOMAIN}\"}" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('  Pages:', 'OK' if d.get('success') else d.get('errors'))"

echo "==> Done! ${DOMAIN} will be live in ~2 minutes (SSL provisioning)."
echo "    PWA manifest: https://${DOMAIN}/api/manifest.json"
