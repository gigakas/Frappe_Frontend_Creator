import { createRouter, createWebHistory } from "vue-router";

// ============================================================
// CONFIGURATION — set by init.sh (do not edit manually)
// ============================================================
const BASE_PATH = "/{{FRONTEND_PATH}}/";
const APP_TITLE = "{{APP_NAME}}";

export const router = createRouter({
	history: createWebHistory(BASE_PATH),
	routes: [
		{
			path: "/",
			component: () => import("@/layouts/AppLayout.vue"),
			children: [
				{
					path: "",
					name: "Home",
					component: () => import("@/pages/Home.vue"),
					meta: { title: "Home", public: true },
				},
			],
		},
		{
			path: "/:pathMatch(.*)*",
			name: "NotFound",
			component: () => import("@/pages/NotFound.vue"),
			meta: { public: true },
		},
	],
});

router.afterEach((to) => {
	document.title = to.meta.title
		? `${to.meta.title} | ${APP_TITLE}`
		: APP_TITLE;
});
