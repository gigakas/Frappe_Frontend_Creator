import { createBrowserRouter } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout"
import Home from "@/pages/Home"
import NotFound from "@/pages/NotFound"

// ============================================================
// CONFIGURATION — set by init.sh (do not edit manually)
// ============================================================
const FRONTEND_PATH = "/{{FRONTEND_PATH}}"

export const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <AppLayout />,
			children: [
				{ index: true, element: <Home /> },
			],
		},
		{ path: "*", element: <NotFound /> },
	],
	{ basename: FRONTEND_PATH },
)
