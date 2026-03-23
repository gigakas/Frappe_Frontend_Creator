import { create } from "zustand"

// Boot data injected by Frappe's Jinja template (www/{path}/index.py)
declare global {
	interface Window {
		user: string
		roles: string[]
		csrf_token: string
		site_name: string
	}
}

interface AuthState {
	user: string
	roles: string[]
	csrfToken: string
	siteName: string
	isLoggedIn: boolean
	isGuest: boolean
}

export const useAuth = create<AuthState>(() => ({
	user: window.user ?? "",
	roles: window.roles ?? [],
	csrfToken: window.csrf_token ?? "",
	siteName: window.site_name ?? "",
	isLoggedIn: !!window.user && window.user !== "Guest",
	isGuest: !window.user || window.user === "Guest",
}))

export function hasRole(role: string): boolean {
	return useAuth.getState().roles.includes(role)
}
