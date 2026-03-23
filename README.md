# Frappe Frontend Creator

Scaffold tool to create Vue 3 or React frontends fully integrated with the Frappe Framework.

---

## Frappe version compatibility

Compatible with **Frappe 15** and **Frappe 16**.

| Element | Notes |
|---|---|
| `website_route_rules` hook | Core hook, stable since v13 |
| `www/{path}/index.py` + `get_context` | Core website pattern, stable |
| `no_cache = 1` | Respected by Frappe's template renderer |
| `frappe.sessions.get_csrf_token()` | Stable across v15 and v16 |
| `frappe.get_roles()`, `frappe._dict`, `frappe.local.site` | Core APIs, unchanged |
| Jinja `{{ boot[key] \| tojson }}` | Standard Jinja2 filter, stable |
| `bench build --app` via root `package.json` | Convention unchanged |

> **Frappe 16 note:** requires Node.js 20 and Python 3.11. The templates have no Node version lock so they build fine on both. Avoid upgrading `frappe-ui` beyond `^0.1.x` without testing, as future major versions may drop Frappe 15 support.

---

## Usage

```bash
bash init.sh
```

The script auto-detects the bench and guides the setup:

```
  Frappe Frontend Template Initializer
  ──────────────────────────────────────

  Framework:
    1) Vue 3
    2) React

  Choose (1/2): _

  Frappe bench detected: /home/user/frappe-bench
    site: mysite.lan  |  port: 8000

  Available apps:
    myapp

  App name: myapp
  Frontend folder (e.g. frontend): frontend

  Configuration:
    App             = /home/user/frappe-bench/apps/myapp
    Frontend folder = /home/user/frappe-bench/apps/myapp/frontend
    URL             = http://mysite.lan:8000/myapp

  Proceed? (Y/n):
```

---

## What the script does

1. Detects the bench and reads `default_site` and `webserver_port` from `common_site_config.json`
2. Lists available apps and prompts to select one
3. Copies the chosen template (Vue or React) to the specified folder
4. Replaces `{{APP_NAME}}`, `{{FRONTEND_PATH}}`, and `{{FOLDER_NAME}}` placeholders in all files
5. Creates `{app_root}/package.json` so `bench build --app` works
6. Creates `{app}/www/{path}/index.py` — Python controller that injects boot data into the Jinja template
7. Appends `website_route_rules` to `hooks.py` for SPA history-mode routing
8. Optionally runs `yarn install`

---

## Post-install first steps

```bash
# 1. Install the app in the site (required — Frappe won't serve www/ pages otherwise)
cd /path/to/frappe-bench
bench --site <site_name> install-app <app_name>

# 2. Initial build
bench build --app <app_name>
```

---

## Development modes

### Vite dev server (HMR)

```bash
cd <frontend_folder>
yarn dev
```

Access at `http://<site>:8080/<url_path>/` — changes are reflected instantly without a full reload.

### Watch mode without Vite (bench only)

```bash
# Terminal 1 — rebuild on save
cd <frontend_folder>
yarn build --watch

# Terminal 2 — Frappe server
cd /path/to/frappe-bench
bench start
```

Access at `http://<site>:8000/<url_path>/` — no HMR, refresh the browser manually.

---

## Other commands

```bash
yarn build        # Production build
yarn type-check   # TypeScript check
yarn lint         # Biome lint + format
yarn test:run     # Run tests (vitest)
```

---

## Build output

```
apps/<app_name>/<app_name>/public/<folder_name>/     # JS/CSS assets
apps/<app_name>/<app_name>/www/<url_path>/index.html # Jinja template (generated on build)
```

---

## Stack by framework

### Vue 3

| Category      | Library                              |
|---------------|--------------------------------------|
| UI Framework  | Vue 3 + TypeScript                   |
| Build         | Vite + frappe-ui/vite                |
| Router        | Vue Router (`createWebHistory`)      |
| State         | Pinia                                |
| API           | frappe-ui (`call`, `createResource`) |
| Styles        | Tailwind CSS + frappe-ui preset      |
| Icons         | unplugin-icons v23 + lucide          |
| Realtime      | Socket.io                            |
| Validation    | Zod                                  |
| Linting       | Biome                                |

### React

| Category      | Library                                     |
|---------------|---------------------------------------------|
| UI Framework  | React 18 + TypeScript                       |
| Build         | Vite + frappe-ui/vite (proxy only)          |
| Router        | React Router v6 (`createBrowserRouter`)     |
| State         | Zustand                                     |
| Server state  | TanStack Query v5                           |
| API           | `utils/frappe.ts` (`call`, `db.*`)          |
| Styles        | Tailwind CSS + frappe-ui preset             |
| Icons         | lucide-react                                |
| Validation    | Zod                                         |
| Linting       | Biome                                       |

> **Note (React):** `frappe-ui/vite` is used only for the dev proxy (`frappeProxy: true`). Jinja HTML generation is handled by a custom `frappeJinjaPlugin` built into `vite.config.js`, since `jinjaBootData` from frappe-ui is Vue-specific.

---

## Generated structure

### Vue 3

```
<folder>/
├── src/
│   ├── main.ts                    # Entry point
│   ├── App.vue                    # Root component
│   ├── index.css                  # Tailwind + frappe-ui styles
│   ├── socket.ts                  # Socket.io
│   ├── router/index.ts            # Vue Router
│   ├── stores/auth.ts             # Auth store (Pinia)
│   ├── types/index.ts             # Frappe types
│   ├── composables/useScreenSize.ts
│   ├── utils/
│   │   ├── index.ts               # General helpers
│   │   ├── formHelpers.ts         # Form helpers
│   │   └── validators.ts          # Zod schemas
│   ├── layouts/AppLayout.vue      # Base layout
│   ├── components/
│   │   ├── Dialogs.vue
│   │   └── common/
│   └── pages/
│       ├── Home.vue               # Demo page — Vue badge
│       └── NotFound.vue
└── vite.config.js
```

### React

```
<folder>/
├── src/
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Tailwind + frappe-ui styles
│   ├── router/index.tsx           # React Router
│   ├── store/auth.ts              # Auth store (Zustand)
│   ├── types/index.ts             # Frappe types
│   ├── hooks/useScreenSize.ts
│   ├── utils/
│   │   ├── index.ts               # General helpers
│   │   └── frappe.ts              # API helpers (call, db.*)
│   ├── layouts/AppLayout.tsx      # Base layout
│   └── pages/
│       ├── Home.tsx               # Demo page — React badge
│       └── NotFound.tsx
└── vite.config.js
```

---

## Customization

### Frappe API calls

**Vue:**
```ts
import { call, createResource } from "frappe-ui"

const result = await call("myapp.api.my_function", { param: "value" })
const list = createResource({ url: "myapp.api.my_list" })
list.fetch()
```

**React:**
```ts
import { call, db } from "@/utils/frappe"
import { useQuery } from "@tanstack/react-query"

// Direct call
const result = await call("myapp.api.my_function", { param: "value" })

// With TanStack Query
const { data } = useQuery({
  queryKey: ["my-list"],
  queryFn: () => db.getList("MyDoctype", { fields: ["name", "title"] }),
})
```

### Adding routes

**Vue** — `src/router/index.ts`:
```ts
{
  path: "/my-page",
  name: "MyPage",
  component: () => import("@/pages/MyPage.vue"),
  meta: { title: "My Page" },
}
```

**React** — `src/router/index.tsx`:
```tsx
{
  path: "/my-page",
  element: <MyPage />,
}
```

### Boot data

The `www/{path}/index.py` controller exposes the following fields to the frontend at page load via `window.*`:

| Key              | Description                        |
|------------------|------------------------------------|
| `user`           | Logged-in username                 |
| `roles`          | User roles array                   |
| `csrf_token`     | CSRF token for API calls           |
| `site_name`      | Current site name                  |
| `setup_complete` | Whether site setup is finished     |

Add more fields by editing `get_boot()` in `www/{path}/index.py`.
