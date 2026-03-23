import { useAuth } from "@/store/auth"

export default function Home() {
	const { user } = useAuth()

	return (
		<div className="flex flex-col items-center justify-center h-full gap-3">
			<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase tracking-wide">
				React
			</span>
			<h1 className="text-3xl font-bold text-gray-900">{{APP_NAME}}</h1>
			<p className="text-gray-500">Welcome, {user}. Your app is ready. Start building!</p>
		</div>
	)
}
