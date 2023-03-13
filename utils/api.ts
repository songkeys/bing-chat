import { showNotification } from "@mantine/notifications";
import { ResponseMessage } from "./example";

export const sendMessage = async (
	prompt: string,
	{
		jailbreakConversationId,
		parentMessageId,
		onProgress,
	}: {
		jailbreakConversationId?: string;
		parentMessageId?: string;
		onProgress?: (text: string) => void;
	}
): Promise<ResponseMessage | undefined> => {
	const response = await fetch("https://gpt.song.work/chat", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			jailbreakConversationId,
			parentMessageId,
			prompt,
		}),
	});

	if (!response.ok) {
		console.error(
			`Error sending message: ${response.status} ${response.statusText}`
		);
		showNotification({
			color: "red",
			title: "Error sending message",
			message: `${response.status} ${response.statusText}`,
		});
	}

	const data = response.body;

	if (data === null) {
		return;
	}

	const reader = data.getReader();
	const decoder = new TextDecoder();
	let done = false;

	let json = "";
	let text = "";
	let result: ResponseMessage | undefined = undefined;
	while (!done) {
		const { value, done: doneReading } = await reader.read();
		done = doneReading;
		const chunk = decoder.decode(value);

		try {
			if (typeof chunk === "undefined") {
				continue;
			}

			if (chunk?.startsWith(`{"conversationId":"`) || Boolean(json)) {
				json += chunk;
			} else {
				text = text + chunk?.toString() ?? "";
				// console.log(text, 2);
				onProgress?.(text);
			}
		} catch (e) {
			console.log("error", e);
		}
	}

	try {
		result = JSON.parse(json);
		if (result && !result.response) {
			// sometimes the response is in the details for "OffenseResponse"!
			result.response = result?.details?.text;
		}
		onProgress?.(result?.response ?? text);
	} catch (e) {
		// console.log({ json });
		console.log("error", e);
	}

	return result;
};
