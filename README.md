# Frappe Frontend Template

Template base para crear frontends integrados con Frappe Framework. Soporta **Vue 3** y **React**.

---

## Uso

```bash
bash init.sh
```

El script detecta automáticamente el bench y guía el proceso:

```
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

## Qué hace el script

1. Detecta el bench, lee `default_site` y `webserver_port` del config
2. Lista las apps disponibles y pide seleccionar una
3. Copia el template (Vue o React) a la carpeta indicada
4. Reemplaza placeholders en todos los archivos
5. Crea `{app_root}/package.json` para `bench build --app`
6. Crea `{app}/www/{path}/index.py` (boot data para Jinja)
7. Agrega `website_route_rules` en `hooks.py` (router history mode)
8. Opcionalmente ejecuta `yarn install`

---

## Primeros pasos post-instalación

```bash
# 1. Instalar la app en el site (requerido la primera vez)
cd /path/to/frappe-bench
bench --site <site_name> install-app <app_name>

# 2. Build inicial
bench build --app <app_name>
```

---

## Modos de desarrollo

### Con vite dev server (HMR)

```bash
cd <frontend_folder>
yarn dev
```

Accede en `http://<site>:8080/<url_path>/` — los cambios se reflejan en tiempo real sin recargar.

### Sin vite, usando solo bench

```bash
# Terminal 1 — rebuild automático al guardar
cd <frontend_folder>
yarn build --watch

# Terminal 2 — servidor Frappe
cd /path/to/frappe-bench
bench start
```

Accede en `http://<site>:8000/<url_path>/` — sin HMR, recarga el browser manualmente.

---

## Otros comandos

```bash
yarn build        # Build de producción
yarn type-check   # Verificación TypeScript
yarn lint         # Biome lint + formato
yarn test:run     # Tests (vitest)
```

---

## Salida del build

```
apps/<app_name>/<app_name>/public/<folder_name>/    # Assets JS/CSS
apps/<app_name>/<app_name>/www/<url_path>/index.html
```

---

## Stack por framework

### Vue 3

| Categoría     | Librería                          |
|---------------|-----------------------------------|
| UI Framework  | Vue 3 + TypeScript                |
| Build         | Vite + frappe-ui/vite             |
| Router        | Vue Router (`createWebHistory`)   |
| State         | Pinia                             |
| API           | frappe-ui (`call`, `createResource`) |
| Estilos       | Tailwind CSS + preset frappe-ui   |
| Iconos        | unplugin-icons + lucide           |
| Tiempo real   | Socket.io                         |
| Validación    | Zod                               |
| Linting       | Biome                             |

### React

| Categoría     | Librería                          |
|---------------|-----------------------------------|
| UI Framework  | React 18 + TypeScript             |
| Build         | Vite + frappe-ui/vite             |
| Router        | React Router v6 (`createBrowserRouter`) |
| State         | Zustand                           |
| Server state  | TanStack Query                    |
| API           | `utils/frappe.ts` (`call`, `db.*`) |
| Estilos       | Tailwind CSS + preset frappe-ui   |
| Iconos        | lucide-react                      |
| Validación    | Zod                               |
| Linting       | Biome                             |

---

## Estructura generada

### Vue 3

```
<folder>/
├── src/
│   ├── main.ts                  # Entry point
│   ├── App.vue                  # Root component
│   ├── index.css                # Tailwind + frappe-ui styles
│   ├── socket.ts                # Socket.io
│   ├── router/index.ts          # Vue Router
│   ├── stores/auth.ts           # Auth store (Pinia)
│   ├── types/index.ts           # Tipos Frappe
│   ├── composables/useScreenSize.ts
│   ├── utils/
│   │   ├── index.ts             # Helpers generales
│   │   ├── formHelpers.ts       # Helpers de formularios
│   │   └── validators.ts        # Schemas Zod
│   ├── layouts/AppLayout.vue    # Layout base
│   ├── components/
│   │   ├── Dialogs.vue
│   │   └── common/
│   └── pages/
│       ├── Home.vue
│       └── NotFound.vue
└── vite.config.js
```

### React

```
<folder>/
├── src/
│   ├── main.tsx                 # Entry point
│   ├── index.css                # Tailwind + frappe-ui styles
│   ├── router/index.tsx         # React Router
│   ├── store/auth.ts            # Auth store (Zustand)
│   ├── types/index.ts           # Tipos Frappe
│   ├── hooks/useScreenSize.ts
│   ├── utils/
│   │   ├── index.ts             # Helpers generales
│   │   └── frappe.ts            # API helpers (call, db.*)
│   ├── layouts/AppLayout.tsx    # Layout base
│   └── pages/
│       ├── Home.tsx
│       └── NotFound.tsx
└── vite.config.js
```

---

## Personalización post-init

### Llamadas a la API Frappe

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

// Llamada directa
const result = await call("myapp.api.my_function", { param: "value" })

// Con TanStack Query
const { data } = useQuery({
  queryKey: ["my-list"],
  queryFn: () => db.getList("MyDoctype", { fields: ["name", "title"] }),
})
```

### Agregar rutas

**Vue** — `src/router/index.ts`:
```ts
{
  path: "/my-page",
  name: "MyPage",
  component: () => import("@/pages/MyPage.vue"),
  meta: { title: "Mi Página" },
}
```

**React** — `src/router/index.tsx`:
```tsx
{
  path: "/my-page",
  element: <MyPage />,
}
```
