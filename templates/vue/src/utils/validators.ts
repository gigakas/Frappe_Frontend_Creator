import { z } from "zod";

export function validateEmail(email: string): boolean {
	const regExp =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return regExp.test(email);
}

export function validateEmailWithZod(email: string): boolean {
	return z.string().email().safeParse(email).success;
}

export function validatePhone(phone: string): boolean {
	return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone);
}

export function validateUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

export function isRequired(value: any): boolean {
	if (value === null || value === undefined) return false;
	if (typeof value === "string") return value.trim().length > 0;
	if (Array.isArray(value)) return value.length > 0;
	return true;
}

export function minLength(value: string, min: number): boolean {
	return value.length >= min;
}

export function maxLength(value: string, max: number): boolean {
	return value.length <= max;
}

export function inRange(value: number, min: number, max: number): boolean {
	return value >= min && value <= max;
}

export const emailSchema = z.string().email("Invalid email address");

export const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
	.regex(/[a-z]/, "Password must contain at least one lowercase letter")
	.regex(/[0-9]/, "Password must contain at least one number");

export const phoneSchema = z
	.string()
	.regex(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, "Invalid phone number");

export const urlSchema = z.string().url("Invalid URL");
export const requiredString = z.string().min(1, "This field is required").trim();
export const optionalString = z.string().optional();

export interface ValidationResult {
	valid: boolean;
	errors: string[];
}

export function validate(value: any, rules: Array<(value: any) => string | null>): ValidationResult {
	const errors: string[] = [];
	for (const rule of rules) {
		const error = rule(value);
		if (error) errors.push(error);
	}
	return { valid: errors.length === 0, errors };
}

export const rules = {
	required: (message = "This field is required") => (value: any) => isRequired(value) ? null : message,
	email: (message = "Invalid email address") => (value: string) => validateEmail(value) ? null : message,
	minLength: (min: number, message?: string) => (value: string) =>
		minLength(value, min) ? null : message || `Must be at least ${min} characters`,
	maxLength: (max: number, message?: string) => (value: string) =>
		maxLength(value, max) ? null : message || `Must be at most ${max} characters`,
	pattern: (regex: RegExp, message = "Invalid format") => (value: string) => regex.test(value) ? null : message,
};
