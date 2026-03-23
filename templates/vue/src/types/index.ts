// Common types for Frappe Vue applications

export interface User {
	name: string;
	full_name: string;
	email: string;
	user_image?: string;
	user_type: "System User" | "Website User";
	enabled: boolean;
	roles?: string[];
}

export interface ApiResponse<T> {
	message: T;
	exc_type?: string;
	exc?: string;
	_server_messages?: string;
}

export interface ListResponse<T> {
	data: T[];
	total_count?: number;
	has_next_page?: boolean;
}

export interface DocTypeBase {
	name: string;
	owner: string;
	creation: string;
	modified: string;
	modified_by: string;
	docstatus: 0 | 1 | 2;
}

export interface FileAttachment {
	name: string;
	file_name: string;
	file_url: string;
	file_size: number;
	is_private: boolean;
	attached_to_doctype?: string;
	attached_to_name?: string;
}

export interface ListFilter {
	field: string;
	operator:
		| "="
		| "!="
		| ">"
		| "<"
		| ">="
		| "<="
		| "like"
		| "not like"
		| "in"
		| "not in"
		| "is"
		| "between";
	value: any;
}

export interface PaginationParams {
	page?: number;
	pageSize?: number;
	orderBy?: string;
	orderDirection?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
	data: T[];
	page: number;
	pageSize: number;
	totalCount: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export interface FormField {
	fieldname: string;
	fieldtype: string;
	label: string;
	required?: boolean;
	options?: string;
	default?: any;
	description?: string;
	read_only?: boolean;
	hidden?: boolean;
}

export interface ToastOptions {
	title?: string;
	message: string;
	type?: "success" | "error" | "warning" | "info";
	duration?: number;
}

export interface DialogOptions {
	title: string;
	message?: string;
	html?: string;
	size?: "sm" | "md" | "lg" | "xl";
	actions?: DialogAction[];
}

export interface DialogAction {
	label: string;
	variant?: "solid" | "subtle" | "outline" | "ghost";
	theme?: "blue" | "red" | "green" | "gray";
	onClick?: () => void | Promise<void>;
}

export interface RouteMeta {
	auth?: boolean;
	public?: boolean;
	admin?: boolean;
	roles?: string[];
	title?: string;
}

export interface NavItem {
	label: string;
	icon?: string;
	to?: string;
	onClick?: () => void;
	children?: NavItem[];
	badge?: string | number;
	active?: boolean;
	disabled?: boolean;
}

export interface TableColumn<T = any> {
	key: keyof T | string;
	label: string;
	sortable?: boolean;
	width?: string;
	align?: "left" | "center" | "right";
	formatter?: (value: any, row: T) => string;
}

export interface SelectOption {
	label: string;
	value: string | number;
	disabled?: boolean;
	description?: string;
}

export interface DateRange {
	start: string | Date;
	end: string | Date;
}

export interface KeyValue<T = any> {
	key: string;
	value: T;
}

export interface Status {
	name: string;
	label: string;
	color: string;
	order?: number;
}
