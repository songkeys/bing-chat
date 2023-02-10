import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
// @ts-ignore
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function CopyToClipboardButton({ value }: { value: string }) {
	const [copiedHint, setCopiedHint] = useState("Copy");

	const handleCopy = () => {
		setCopiedHint("Copied");
	};

	useEffect(() => {
		if (copiedHint !== "Copied") return;

		const timer = setTimeout(() => {
			setCopiedHint("Copy");
		}, 3000);

		return () => {
			clearTimeout(timer);
		};
	}, [copiedHint]);

	return (
		<CopyToClipboard text={value} onCopy={handleCopy}>
			<Button
				size="xs"
				variant="subtle"
				disabled={!value || (value as string)?.length === 0}
			>
				{copiedHint}
			</Button>
		</CopyToClipboard>
	);
}
