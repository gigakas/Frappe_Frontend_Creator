import { computed, onMounted, onUnmounted, reactive } from "vue";

export function useScreenSize() {
	const size = reactive({
		width: typeof window !== "undefined" ? window.innerWidth : 0,
		height: typeof window !== "undefined" ? window.innerHeight : 0,
	});

	const onResize = () => {
		size.width = window.innerWidth;
		size.height = window.innerHeight;
	};

	onMounted(() => window.addEventListener("resize", onResize));
	onUnmounted(() => window.removeEventListener("resize", onResize));

	const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

	const isMobileView = computed(() => size.width < breakpoints.sm);
	const isTabletView = computed(() => size.width >= breakpoints.sm && size.width < breakpoints.lg);
	const isDesktopView = computed(() => size.width >= breakpoints.lg);
	const isSmAndUp = computed(() => size.width >= breakpoints.sm);
	const isMdAndUp = computed(() => size.width >= breakpoints.md);
	const isLgAndUp = computed(() => size.width >= breakpoints.lg);
	const isXlAndUp = computed(() => size.width >= breakpoints.xl);

	return {
		size,
		breakpoints,
		isMobileView,
		isTabletView,
		isDesktopView,
		isSmAndUp,
		isMdAndUp,
		isLgAndUp,
		isXlAndUp,
	};
}
