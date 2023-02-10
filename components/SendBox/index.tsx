import { sendMessage } from "@/utils/api";
import {
	isSendingAtom,
	resultAtom,
	resultsAtom,
	textAtom,
} from "@/utils/store";
import { ActionIcon, Group, Loader, Textarea } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { m, useAnimationControls } from "framer-motion";
import { useAtom } from "jotai";
import { useState } from "react";

export default function SendBox() {
	const [value, setValue] = useState("");
	const [opt, setOpt] = useState<{
		conversationId?: string;
		conversationSignature?: string;
		clientId?: string;
		invocationId?: number;
	}>({
		conversationId: undefined,
		conversationSignature: undefined,
		clientId: undefined,
		invocationId: undefined,
	});

	const [isSending, setIsSending] = useAtom(isSendingAtom);
	const [text, setText] = useAtom(textAtom);
	const [result, setResult] = useAtom(resultAtom);
	const [results, setResults] = useAtom(resultsAtom);

	const controls = useAnimationControls();

	const send = async () => {
		const v = value.trim();

		if (!v || isSending) {
			//shake
			controls.start({
				x: [0, 5, -5, 5, -5, 5, -5, 5, -5, 0],
				transition: { duration: 1 },
			});
			return;
		}

		setValue("");
		setResults((prev) => [
			...prev,
			{ role: "user", text: v },
			{ role: "bot", text: "......" },
		]);

		try {
			setIsSending(true);
			const result = await sendMessage(v, {
				...opt,
				onProgress(text) {
					setText(text);
					setResults((prev) => {
						const newPrev = [...prev];
						newPrev[newPrev.length - 1] = {
							role: "bot",
							text,
						};
						return newPrev;
					});
				},
			});
			if (result) {
				setResult(result);
				setOpt({
					conversationId: result.conversationId,
					conversationSignature: result.conversationSignature,
					clientId: result.clientId,
					invocationId: result.invocationId,
				});
				if (result.response) {
					setText(result.response);
				}
				setResults((prev) => {
					const newPrev = [...prev];
					newPrev[newPrev.length - 1] = {
						role: "bot",
						text: result.response ?? prev[prev.length - 1].text,
						result,
					};
					return newPrev;
				});
			}
		} catch (e) {
			console.log("error", e);
			setResults((prev) => {
				const newPrev = [...prev];
				newPrev[newPrev.length - 1] = {
					role: "bot",
					text: "Sorry, something went wrong. Please try again.",
				};
				return newPrev;
			});
		} finally {
			setIsSending(false);
		}
	};

	return (
		<m.div className="fixed left-5 right-5 bottom-5" animate={controls}>
			<div className="max-w-[600px] mx-auto w-full">
				<Group>
					<Textarea
						className="w-full"
						placeholder="Ask me anything..."
						autoCapitalize="true"
						spellCheck
						autoFocus
						autosize
						maxRows={5}
						rightSection={
							<ActionIcon onClick={() => send()}>
								{isSending ? <Loader size={20} /> : <IconSend />}
							</ActionIcon>
						}
						value={value}
						onChange={(e) => setValue(e.currentTarget.value)}
						onKeyDown={(e) => {
							const isEnter = e.key === "Enter" || e.keyCode === 13;
							const isNotShift = !e.shiftKey;
							if (isEnter && isNotShift) {
								e.preventDefault();
								e.stopPropagation();
								setTimeout(() => {
									send();
								}, 20);
							}
						}}
					></Textarea>
				</Group>
			</div>
		</m.div>
	);
}
