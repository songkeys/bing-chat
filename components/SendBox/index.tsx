import { sendMessage } from "@/utils/api";
import {
	isSendingAtom,
	resultAtom,
	resultsAtom,
	textAtom,
} from "@/utils/store";
import {
	ActionIcon,
	Button,
	Group,
	Loader,
	ScrollArea,
	Textarea,
} from "@mantine/core";
import { IconSend, IconX } from "@tabler/icons-react";
import { AnimatePresence, m, useAnimationControls } from "framer-motion";
import { useAtom } from "jotai";
import { useState } from "react";
import ClearIcon from "./ClearIcon";

export default function SendBox() {
	const [value, setValue] = useState("");
	const [opt, setOpt] = useState<{
		jailbreakConversationId?: string;
		parentMessageId?: string;
	}>({
		jailbreakConversationId: undefined,
		parentMessageId: undefined,
	});

	const [isSending, setIsSending] = useAtom(isSendingAtom);
	const [text, setText] = useAtom(textAtom);
	const [result, setResult] = useAtom(resultAtom);
	const [results, setResults] = useAtom(resultsAtom);

	const controls = useAnimationControls();

	const [showSuggestions, setShowSuggestions] = useState(true);

	const send = async (v: string) => {
		v = v.trim();

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
					jailbreakConversationId: result.jailbreakConversationId,
					parentMessageId: result.parentMessageId,
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
			setShowSuggestions(true); // flip to enable suggestions
		}
	};

	const clearMessages = () => {
		if (isSending) {
			//shake
			controls.start({
				x: [0, 5, -5, 5, -5, 5, -5, 5, -5, 0],
				transition: { duration: 1 },
			});
			return;
		}
		setResults([]);
		setResult(undefined);
		setOpt({
			jailbreakConversationId: undefined,
			parentMessageId: undefined,
		});
	};

	return (
		<m.div className="fixed left-5 right-5 bottom-5" animate={controls}>
			<div className="max-w-[600px] mx-auto w-full">
				{/* suggested questions */}
				{result?.details.suggestedResponses &&
					!isSending &&
					showSuggestions && (
						<div className="relative">
							{/* close btn */}
							<div className="absolute top-0 bottom-3 right-0 z-10 w-20 flex justify-end items-center">
								<ActionIcon
									// color="dark.5"
									variant="light"
									onClick={() => setShowSuggestions(false)}
								>
									<IconX />
								</ActionIcon>
							</div>

							{/* scrollable suggestions */}
							<ScrollArea offsetScrollbars>
								<div className="flex gap-2 overflow-x-scroll whitespace-nowrap">
									{result.details.suggestedResponses.map((s, i) => (
										<AnimatePresence key={s.messageId}>
											<m.div
												initial={{ opacity: 0, y: 50 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: 50 }}
												transition={{ delay: i * 0.2, duration: 0.5 }}
											>
												<Button
													size="xs"
													className="px-3 py-2 bg-gray-100 rounded-md"
													onClick={() => send(s.text)}
												>
													{s.text}
												</Button>
											</m.div>
										</AnimatePresence>
									))}
								</div>
							</ScrollArea>
						</div>
					)}

				{/* textarea */}
				<Group noWrap>
					<ActionIcon
						color="gray"
						variant="subtle"
						onClick={() => clearMessages()}
					>
						<ClearIcon />
					</ActionIcon>
					<Textarea
						className="flex-grow w-full"
						placeholder="Ask me anything..."
						autoCapitalize="true"
						spellCheck
						autoFocus
						autosize
						maxRows={5}
						rightSection={
							<ActionIcon onClick={() => send(value)}>
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
									send(value);
								}, 20);
							}
						}}
					></Textarea>
				</Group>
			</div>
		</m.div>
	);
}
