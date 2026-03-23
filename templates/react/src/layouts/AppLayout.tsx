import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/store/auth"

export default function AppLayout() {
	const { isLoggedIn } = useAuth()

	if (!isLoggedIn) {
		window.location.href = `/login?redirect-to=${window.location.pathname}`
		return null
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Outlet />
		</div>
	)
}
