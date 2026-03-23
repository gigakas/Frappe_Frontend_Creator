import { router } from "@/router";
import { call, createResource } from "frappe-ui";
import { defineStore } from "pinia";
import { computed, type ComputedRef, type Ref, ref } from "vue";

// ============================================================
// CONFIGURATION — update these for your app
// ============================================================
const LOGIN_PAGE = "/login?redirect-to=/{{FRONTEND_PATH}}";

// Custom API endpoint for user info — replace with your own
const URI_USER_INFO = "{{APP_NAME}}.api.auth.get_user";

export const useAuthStore = defineStore("auth", () => {
	const userInfo = createResource({
		url: URI_USER_INFO,
		transform: (data: any) => data || {},
	});

	const init = async () => {
		const sessionUserEmail = sessionUser();
		if (!sessionUserEmail || userInfo.fetched) return;
		await userInfo.fetch();
	};

	const reloadUser = userInfo.reload;

	const user__ = computed(() => userInfo.data || {});
	const userId: ComputedRef<string> = computed(() => user__.value.user_id || "");
	const userImage: ComputedRef<string> = computed(() => user__.value.user_image || "");
	const userName: ComputedRef<string> = computed(() => user__.value.user_name || "");
	const userEmail: ComputedRef<string> = computed(() => user__.value.user_id || "");

	const hasDeskAccess: ComputedRef<boolean> = computed(() => user__.value.has_desk_access === true);
	const isAdmin: ComputedRef<boolean> = computed(() => user__.value.is_admin === true);
	const roles: ComputedRef<string[]> = computed(() => user__.value.roles || []);

	function sessionUser(): string | null {
		const cookies = new URLSearchParams(document.cookie.split("; ").join("&"));
		const _sessionUser = cookies.get("user_id");
		if (_sessionUser === "Guest" || !_sessionUser) return null;
		return _sessionUser;
	}

	const user: Ref<string | null> = ref(sessionUser());
	const isLoggedIn: ComputedRef<boolean> = computed(() => !!user.value);

	const login = createResource({
		url: "login",
		onError() {
			throw new Error("Invalid email or password");
		},
		onSuccess() {
			user.value = sessionUser();
			login.reset();
			router.replace({ path: "/" });
		},
	});

	function logout() {
		user.value = null;
		call("logout").then(() => {
			window.location.href = LOGIN_PAGE;
		});
	}

	return {
		user,
		userId,
		userImage,
		userName,
		userEmail,
		isLoggedIn,
		hasDeskAccess,
		isAdmin,
		roles,
		init,
		reloadUser,
		login,
		logout,
	};
});
