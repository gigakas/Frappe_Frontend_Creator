import { useEffect, useState } from "react"

const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 }

export function useScreenSize() {
	const [width, setWidth] = useState(window.innerWidth)

	useEffect(() => {
		const handler = () => setWidth(window.innerWidth)
		window.addEventListener("resize", handler)
		return () => window.removeEventListener("resize", handler)
	}, [])

	return {
		width,
		isMobile: width < breakpoints.md,
		isTablet: width >= breakpoints.md && width < breakpoints.lg,
		isDesktop: width >= breakpoints.lg,
	}
}
