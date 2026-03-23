import { Button, Dialog, ErrorMessage, FrappeUI, frappeRequest, setConfig, toast } from "frappe-ui";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import Dialogs from "./components/Dialogs.vue";
import "./index.css";
import { router } from "./router";
import { socket } from "./socket";

setConfig("resourceFetcher", frappeRequest);

setConfig("fallbackErrorHandler", (error: any) => {
	const msg = error.exc_type
		? (error.messages || error.message || []).join(", ")
		: error.message;
	toast.error(msg);
});

const app = createApp(App);

app.use(FrappeUI);
app.use(createPinia());
app.use(router);

app.component("Button", Button);
app.component("Dialog", Dialog);
app.component("Dialogs", Dialogs);
app.component("ErrorMessage", ErrorMessage);

app.config.globalProperties.$socket = socket;

app.mount("#app");
