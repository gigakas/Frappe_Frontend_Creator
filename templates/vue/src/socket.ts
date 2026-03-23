import { getCachedListResource, getCachedResource } from "frappe-ui";
import { io, type Socket } from "socket.io-client";

function init(): Socket {
	const host = window.location.hostname;
	const port = window.location.port;
	const protocol = window.location.protocol === "https:" ? "https" : "http";

	const isProduction = !port || port === "80" || port === "443";
	const socketPort = isProduction ? "" : ":9000";

	const url = `${protocol}://${host}${socketPort}`;

	const socket = io(url, {
		withCredentials: true,
		reconnectionAttempts: 3,
		transports: ["websocket", "polling"],
	});

	socket.on("refetch_resource", (data: { cache_key?: string }) => {
		if (data.cache_key) {
			const resource =
				getCachedResource(data.cache_key) ||
				getCachedListResource(data.cache_key);
			if (resource) {
				resource.reload();
			}
		}
	});

	return socket;
}

export const socket = init();
