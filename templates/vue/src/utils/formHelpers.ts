export function resetFields<T extends Record<string, any>>(fields: T, defaults: T): void {
	for (const key of Object.keys(defaults) as Array<keyof T>) {
		fields[key] = defaults[key];
	}
}

export function hasChanges<T extends Record<string, any>>(current: T, original: T): boolean {
	for (const key of Object.keys(original) as Array<keyof T>) {
		if (JSON.stringify(current[key]) !== JSON.stringify(original[key])) return true;
	}
	return false;
}

export function getChangedFields<T extends Record<string, any>>(current: T, original: T): Partial<T> {
	const changes: Partial<T> = {};
	for (const key of Object.keys(original) as Array<keyof T>) {
		if (JSON.stringify(current[key]) !== JSON.stringify(original[key])) {
			changes[key] = current[key];
		}
	}
	return changes;
}

export function toBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			const result = reader.result as string;
			resolve(result.split(",")[1]);
		};
		reader.onerror = (error) => reject(error);
	});
}

export function deepClone<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj));
}

export function objectToFormData(
	obj: Record<string, any>,
	formData = new FormData(),
	parentKey = "",
): FormData {
	for (const key of Object.keys(obj)) {
		const value = obj[key];
		const fullKey = parentKey ? `${parentKey}[${key}]` : key;
		if (value === null || value === undefined) continue;
		if (value instanceof File) formData.append(fullKey, value);
		else if (value instanceof Date) formData.append(fullKey, value.toISOString());
		else if (typeof value === "object" && !Array.isArray(value)) objectToFormData(value, formData, fullKey);
		else if (Array.isArray(value)) {
			value.forEach((item, index) => {
				if (typeof item === "object") objectToFormData(item, formData, `${fullKey}[${index}]`);
				else formData.append(`${fullKey}[${index}]`, String(item));
			});
		} else {
			formData.append(fullKey, String(value));
		}
	}
	return formData;
}

export function trimObjectStrings<T extends Record<string, any>>(obj: T): T {
	const result = { ...obj };
	for (const key of Object.keys(result) as Array<keyof T>) {
		if (typeof result[key] === "string") (result[key] as any) = (result[key] as string).trim();
	}
	return result;
}

export function removeEmpty<T extends Record<string, any>>(obj: T): Partial<T> {
	const result: Partial<T> = {};
	for (const key of Object.keys(obj) as Array<keyof T>) {
		const value = obj[key];
		if (value !== null && value !== undefined && value !== "") result[key] = value;
	}
	return result;
}

export function formatApiErrors(error: any): Record<string, string> | string | null {
	if (!error) return null;
	if (error._server_messages) {
		try {
			const messages = JSON.parse(error._server_messages);
			return messages.map((m: string) => JSON.parse(m).message).join(", ");
		} catch {
			return error._server_messages;
		}
	}
	if (error.message) return error.message;
	if (typeof error === "object") {
		const fieldErrors: Record<string, string> = {};
		for (const key of Object.keys(error)) {
			if (typeof error[key] === "string") fieldErrors[key] = error[key];
		}
		if (Object.keys(fieldErrors).length > 0) return fieldErrors;
	}
	return "An unknown error occurred";
}
