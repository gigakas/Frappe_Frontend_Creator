// Frappe API utilities

function getCsrfToken(): string {
	return window.csrf_token ?? ""
}

/**
 * Call a whitelisted Frappe method.
 * Usage: call("myapp.api.my_function", { param: "value" })
 */
export async function call<T = any>(method: string, params?: Record<string, any>): Promise<T> {
	const res = await fetch("/api/method/" + method, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Frappe-CSRF-Token": getCsrfToken(),
		},
		body: JSON.stringify(params ?? {}),
	})

	const json = await res.json()

	if (!res.ok || json.exc) {
		throw new Error(json.exception ?? json._server_messages ?? "Request failed")
	}

	return json.message as T
}

// Frappe DB helpers
export const db = {
	getDoc: <T = any>(doctype: string, name: string) =>
		call<T>("frappe.client.get", { doctype, name }),

	getList: <T = any>(
		doctype: string,
		opts: { fields?: string[]; filters?: any[]; limit?: number; order_by?: string } = {},
	) =>
		call<T[]>("frappe.client.get_list", { doctype, ...opts }),

	insert: <T = any>(doc: Record<string, any>) =>
		call<T>("frappe.client.insert", { doc }),

	setValue: (doctype: string, name: string, fieldname: string, value: any) =>
		call("frappe.client.set_value", { doctype, name, fieldname, value }),

	delete: (doctype: string, name: string) =>
		call("frappe.client.delete", { doctype, name }),
}
