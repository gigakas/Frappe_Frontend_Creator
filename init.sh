#!/usr/bin/env bash
# ============================================================
# init.sh — Frappe Frontend Template Initializer (Vue / React)
#
# Prompts for:
#   1. Framework       (vue | react)
#   2. Frappe app path (auto-detected from bench)
#   3. Frontend folder (e.g. frontend)
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Detect Frappe bench ───────────────────────────────────────
echo ""
echo "  Frappe Frontend Template Initializer"
echo "  ──────────────────────────────────────"
echo ""

# ── Select framework ──────────────────────────────────────────
echo "  Framework:"
echo "    1) Vue 3"
echo "    2) React"
echo ""
read -rp "  Choose (1/2): " FW_CHOICE
case "$FW_CHOICE" in
	1|vue|Vue) FRAMEWORK="vue" ;;
	2|react|React) FRAMEWORK="react" ;;
	*)
		echo "  [!] Invalid choice. Aborting."
		exit 1
		;;
esac

TEMPLATE_DIR="${SCRIPT_DIR}/templates/${FRAMEWORK}"
echo "  → Using template: $FRAMEWORK"
echo ""

BENCH_DIR=""

# Search for bench dirs (have both apps/ and sites/ subfolders) under HOME and /opt
while IFS= read -r candidate; do
	BENCH_DIR="$candidate"
	break
done < <(find "$HOME" /opt /var/www 2>/dev/null -maxdepth 4 -type d -name "apps" \
	| while IFS= read -r apps_dir; do
		parent="$(dirname "$apps_dir")"
		[[ -d "$parent/sites" ]] && echo "$parent"
	done | sort -u)

if [[ -n "$BENCH_DIR" ]]; then
	CFG="$BENCH_DIR/sites/common_site_config.json"
	WEBSERVER_PORT=$(grep -oP '"webserver_port":\s*\K[0-9]+' "$CFG" 2>/dev/null || echo "8000")
	DEFAULT_SITE=$(grep -oP '"default_site":\s*"\K[^"]+' "$CFG" 2>/dev/null || echo "localhost")
	echo "  Frappe bench detected: $BENCH_DIR"
	echo "    site: $DEFAULT_SITE  |  port: $WEBSERVER_PORT"
else
	echo "  [!] Could not auto-detect bench. Enter the path manually."
	read -rp "  Bench path (e.g. /home/user/frappe-bench): " BENCH_DIR
	BENCH_DIR="${BENCH_DIR%/}"
	if [[ -z "$BENCH_DIR" || ! -d "$BENCH_DIR/apps" ]]; then
		echo "  [!] Not a valid bench directory: $BENCH_DIR"
		exit 1
	fi
	CFG="$BENCH_DIR/sites/common_site_config.json"
	WEBSERVER_PORT=$(grep -oP '"webserver_port":\s*\K[0-9]+' "$CFG" 2>/dev/null || echo "8000")
	DEFAULT_SITE=$(grep -oP '"default_site":\s*"\K[^"]+' "$CFG" 2>/dev/null || echo "localhost")
fi

# ── Pick app ──────────────────────────────────────────────────
echo ""
echo "  Available apps:"
mapfile -t APPS < <(find "$BENCH_DIR/apps" -maxdepth 1 -mindepth 1 -type d \
	! -name "frappe" -printf "    %f\n" | sort)
printf '%s\n' "${APPS[@]}"
echo ""

read -rp "  App name: " APP_NAME
APP_DIR="$BENCH_DIR/apps/$APP_NAME"
if [[ -z "$APP_NAME" || ! -d "$APP_DIR" ]]; then
	echo "  [!] App not found: $APP_DIR"
	exit 1
fi

read -rp "  Frontend folder   (e.g. frontend): " FOLDER_NAME
if [[ -z "$FOLDER_NAME" ]]; then
	echo "  [!] Folder name is required. Aborting."
	exit 1
fi

FRONTEND_PATH="$APP_NAME"
DEST_DIR="$APP_DIR/$FOLDER_NAME"

echo ""
echo "  Configuration:"
echo "    App             = $APP_DIR"
echo "    Frontend folder = $DEST_DIR"
echo "    URL             = http://$DEFAULT_SITE:$WEBSERVER_PORT/$FRONTEND_PATH"
echo ""
read -rp "  Proceed? (Y/n): " PROCEED
if [[ "${PROCEED,,}" == "n" ]]; then
	echo "  Aborted."
	exit 0
fi

if [[ -d "$DEST_DIR" ]]; then
	echo "  [!] Destination already exists: $DEST_DIR"
	read -rp "      Overwrite? (y/N): " CONFIRM
	if [[ "${CONFIRM,,}" != "y" ]]; then
		echo "  Aborted."
		exit 0
	fi
fi

# ── Copy ─────────────────────────────────────────────────────
echo ""
echo "  Copying template to: $DEST_DIR"
cp -r "$TEMPLATE_DIR" "$DEST_DIR"

# ── Replace placeholders ─────────────────────────────────────
echo "  Replacing placeholders..."
echo "    {{APP_NAME}}      -> $APP_NAME"
echo "    {{FRONTEND_PATH}} -> $FRONTEND_PATH"
echo "    {{FOLDER_NAME}}   -> $FOLDER_NAME"

# Find all non-binary files and do in-place replacement
find "$DEST_DIR" -type f \
	\( -name "*.ts" -o -name "*.tsx" -o -name "*.vue" -o -name "*.js" -o -name "*.jsx" -o -name "*.json" -o -name "*.html" -o -name "*.css" \) \
	| while IFS= read -r file; do
		sed -i "s|{{APP_NAME}}|${APP_NAME}|g" "$file"
		sed -i "s|{{FRONTEND_PATH}}|${FRONTEND_PATH}|g" "$file"
		sed -i "s|{{FOLDER_NAME}}|${FOLDER_NAME}|g" "$file"
	done

# ── Frappe app integration ────────────────────────────────────
APP_PKG_DIR="$APP_DIR/$APP_NAME"
WWW_DIR="$APP_PKG_DIR/www/$FRONTEND_PATH"
ROOT_PKG="$APP_DIR/package.json"

echo ""
echo "  Setting up Frappe app integration..."

# 1. Root package.json for bench build --app
if [[ -f "$ROOT_PKG" ]]; then
	echo "    [!] $ROOT_PKG already exists — add this build script manually if missing:"
	echo "          \"build\": \"cd $FOLDER_NAME && yarn build\""
else
	cat > "$ROOT_PKG" <<EOF
{
  "scripts": {
    "build": "cd $FOLDER_NAME && yarn build"
  }
}
EOF
	echo "    Created: $ROOT_PKG"
fi

# 2. www directory so the vite plugin can write the Jinja index.html on build
if [[ ! -d "$APP_PKG_DIR" ]]; then
	echo "    [!] Python package not found at: $APP_PKG_DIR"
	echo "        Expected: $APP_DIR/$APP_NAME/"
else
	mkdir -p "$WWW_DIR"
	echo "    Created: $WWW_DIR"

	# 3. hooks.py — website_route_rules for Vue Router history mode
	#    Two rules needed: one for sub-paths, one for the root path itself.
	HOOKS_FILE="$APP_PKG_DIR/hooks.py"
	if [[ ! -f "$HOOKS_FILE" ]]; then
		echo "    [!] hooks.py not found at: $HOOKS_FILE — add website_route_rules manually."
	elif grep -q "website_route_rules" "$HOOKS_FILE"; then
		echo "    [!] website_route_rules already in hooks.py — verify it includes:"
		echo "          {\"from_route\": \"/$FRONTEND_PATH/<path:app_path>\", \"to_route\": \"$FRONTEND_PATH\"}"
		echo "          {\"from_route\": \"/$FRONTEND_PATH\", \"to_route\": \"$FRONTEND_PATH\"}"
	else
		cat >> "$HOOKS_FILE" <<EOF

# Serve the Vue SPA for all routes (Vue Router history mode)
website_route_rules = [
    {"from_route": "/$FRONTEND_PATH/<path:app_path>", "to_route": "$FRONTEND_PATH"},
    {"from_route": "/$FRONTEND_PATH", "to_route": "$FRONTEND_PATH"},
]
EOF
		echo "    Updated: $HOOKS_FILE (website_route_rules)"
	fi

	# 4. www/{FRONTEND_PATH}/index.py — Python controller that injects boot data
	#    Required: the Jinja template uses {{ boot[key] | tojson }}, which this populates.
	INDEX_PY="$WWW_DIR/index.py"
	if [[ -f "$INDEX_PY" ]]; then
		echo "    [!] $INDEX_PY already exists, skipping."
	else
		cat > "$INDEX_PY" <<EOF
import frappe
from frappe.utils import cint

no_cache = 1


def get_context(context):
    context.boot = get_boot()
    return context


def get_boot():
    user = frappe.session.user
    return frappe._dict({
        "user": user,
        "roles": frappe.get_roles(user),
        "csrf_token": frappe.sessions.get_csrf_token(),
        "site_name": frappe.local.site,
        "setup_complete": cint(frappe.get_system_settings("setup_complete")),
    })
EOF
		echo "    Created: $INDEX_PY"
	fi
fi

# ── Install dependencies ──────────────────────────────────────
echo ""
read -rp "  Install dependencies with yarn now? (Y/n): " DO_INSTALL
if [[ "${DO_INSTALL,,}" != "n" ]]; then
	echo "  Running: yarn install"
	cd "$DEST_DIR"
	yarn install
	echo "  Done."
fi

# ── Check if app is installed in site ────────────────────────
APP_INSTALLED=false
if command -v bench &>/dev/null; then
	if bench --site "$DEFAULT_SITE" list-apps 2>/dev/null | grep -q "^$APP_NAME"; then
		APP_INSTALLED=true
	fi
fi

# ── Summary ──────────────────────────────────────────────────
echo ""
echo "  ✔ Frontend initialized at: $DEST_DIR"
echo ""
echo "  Next steps:"
echo ""

STEP=1
if [[ "$APP_INSTALLED" == "false" ]]; then
	echo "  $STEP. Install the app in the site (required — Frappe won't serve www/ pages otherwise):"
	echo "       cd $BENCH_DIR"
	echo "       bench --site $DEFAULT_SITE install-app $APP_NAME"
	echo ""
	STEP=$((STEP + 1))
fi

echo "  $STEP. Build the frontend:"
echo "       cd $BENCH_DIR && bench build --app $APP_NAME"
echo "       — or —"
echo "       cd $DEST_DIR && yarn build"
echo ""
STEP=$((STEP + 1))

echo "  $STEP. Dev server (with hot reload, proxies to local Frappe):"
echo "       cd $DEST_DIR && yarn dev"
echo ""

echo "  Serves at:  http://$DEFAULT_SITE:$WEBSERVER_PORT/$FRONTEND_PATH"
echo "  Assets:     $APP_PKG_DIR/public/$FOLDER_NAME/"
echo "  Template:   $APP_PKG_DIR/www/$FRONTEND_PATH/index.html"
echo ""
