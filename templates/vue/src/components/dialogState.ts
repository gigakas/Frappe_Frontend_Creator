import { reactive, ref } from "vue";

export interface DialogOptions {
	title?: string;
	message?: string;
	html?: string;
	error?: string;
	show?: boolean;
	key?: string;
	actions?: Array<{
		label: string;
		variant?: string;
		onClick?: () => void | Promise<void>;
	}>;
}

export const dialogs = ref<DialogOptions[]>([]);

export function createDialog(dialogOptions: DialogOptions) {
	const dialog = reactive<DialogOptions>(dialogOptions);
	dialog.key = `dialog-${dialogs.value.length}`;
	dialog.show = false;
	setTimeout(() => {
		dialog.show = true;
	}, 0);
	dialogs.value.push(dialog);
}
