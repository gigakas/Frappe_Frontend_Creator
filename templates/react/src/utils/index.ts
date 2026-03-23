import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export function formatDate(date: string | Date, format = "DD/MM/YYYY"): string {
	return dayjs(date).format(format)
}

export function timeAgo(date: string | Date): string {
	return dayjs(date).fromNow()
}

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
	let timer: ReturnType<typeof setTimeout>
	return (...args: Parameters<T>) => {
		clearTimeout(timer)
		timer = setTimeout(() => fn(...args), delay)
	}
}

export function titleCase(str: string): string {
	return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}
