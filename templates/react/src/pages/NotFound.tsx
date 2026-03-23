import { useNavigate } from "react-router-dom"

export default function NotFound() {
	const navigate = useNavigate()

	return (
		<div className="flex flex-col items-center justify-center min-h-screen gap-4">
			<h1 className="text-6xl font-bold text-gray-300">404</h1>
			<p className="text-gray-500">Página no encontrada</p>
			<button
				type="button"
				onClick={() => navigate("/")}
				className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
			>
				Volver al inicio
			</button>
		</div>
	)
}
