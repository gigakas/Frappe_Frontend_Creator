// Common Frappe response types

export interface FrappeDoc {
	name: string
	owner: string
	creation: string
	modified: string
	modified_by: string
	doctype: string
	[key: string]: any
}

export interface FrappeListResponse<T> {
	data: T[]
}

export interface FrappeError {
	exc_type: string
	exception: string
	message: string
}
