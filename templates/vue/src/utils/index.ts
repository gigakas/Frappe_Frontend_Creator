import { useClipboard, useDateFormat, useTimeAgo } from "@vueuse/core";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { toast } from "frappe-ui";
import { ref } from "vue";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function copyToClipboard(text: string, message = "Copied to clipboard"): Promise<void> {
	const { copy } = useClipboard();
	if (navigator.clipboard && window.isSecureContext) {
		await navigator.clipboard.writeText(text);
	} else {
		const input = document.createElement("input");
		document.body.appendChild(input);
		input.value = text;
		input.select();
		document.execCommand("copy");
		input.remove();
	}
	toast.success(message);
}

export function dateFormat(date: string | Date, format = "DD-MM-YYYY HH:mm:ss"): string {
	return useDateFormat(date, format).value;
}

export function timeAgo(date: string | Date): string {
	return useTimeAgo(date).value;
}

export const dateTooltipFormat = "ddd, MMM D, YYYY h:mm A";

export function showError(title: string, message: string): void {
	toast.error(message);
}

export function formatTime(seconds: number): string {
	const days = Math.floor(seconds / (3600 * 24));
	const hours = Math.floor((seconds % (3600 * 24)) / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	let formattedTime = "";
	if (days > 0) formattedTime += `${days}d `;
	if (hours > 0 || days > 0) formattedTime += `${hours}h `;
	if (minutes > 0 || hours > 0 || days > 0) formattedTime += `${minutes}m `;
	formattedTime += `${remainingSeconds >= 10 ? remainingSeconds : "0" + remainingSeconds}s`;

	return formattedTime.trim();
}

export function getTimeInSeconds(time: string): number {
	const timeParts = time.split(" ");
	let seconds = 0;
	timeParts.forEach((part) => {
		if (part.endsWith("d")) seconds += parseInt(part) * 24 * 60 * 60;
		else if (part.endsWith("h")) seconds += parseInt(part) * 60 * 60;
		else if (part.endsWith("m")) seconds += parseInt(part) * 60;
		else if (part.endsWith("s")) seconds += parseInt(part);
	});
	return seconds;
}

export function formatTimeShort(date: string): string {
	const now = dayjs();
	const inputDate = dayjs(date);
	const diffSeconds = now.diff(inputDate, "second");
	const diffMinutes = now.diff(inputDate, "minute");
	const diffHours = now.diff(inputDate, "hour");
	const diffDays = now.diff(inputDate, "day");
	const diffWeeks = now.diff(inputDate, "week");
	const diffMonths = now.diff(inputDate, "month");
	const diffYears = now.diff(inputDate, "year");

	if (diffSeconds < 60) return `${diffSeconds}s`;
	if (diffMinutes < 60) return `${diffMinutes}m`;
	if (diffHours < 24) return `${diffHours}h`;
	if (diffDays < 7) return `${diffDays}d`;
	if (diffWeeks < 4) return `${diffWeeks}w`;
	if (diffMonths < 12) return `${diffMonths}M`;
	return `${diffYears}Y`;
}

export function isContentEmpty(content: string): boolean {
	const parser = new DOMParser();
	const doc = parser.parseFromString(content, "text/html");
	return doc.body.textContent === "";
}

export function isTouchScreenDevice(): boolean {
	return "ontouchstart" in document.documentElement;
}

export const isCustomerPortal = ref(false);

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}

export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void {
	let inThrottle: boolean;
	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			fn(...args);
			inThrottle = true;
			setTimeout(() => (inThrottle = false), limit);
		}
	};
}

export function generateId(prefix = "id"): string {
	return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

export function safeJsonParse<T>(json: string, fallback: T): T {
	try {
		return JSON.parse(json);
	} catch {
		return fallback;
	}
}
