import { resultsAtom } from "@/utils/store";
import { Box, Stack } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";

import classNames from "classnames";
import { m } from "framer-motion";
import { useAtom } from "jotai";
import { useEffect } from "react";
import MdRenderer from "./MdRenderer";

export default function Messages() {
	const [results] = useAtom(resultsAtom);

	const [_, scrollTo] = useWindowScroll();

	useEffect(() => {
		scrollTo({ y: document.body.scrollHeight });
	}, [results]);

	return (
		<Stack
			className="h-full overflow-y-auto pb-[100px] mx-auto"
			style={{
				width: "min(100%, 600px)",
			}}
		>
			{results.map((result, i) => (
				<m.div
					key={i}
					layout
					className={classNames(
						"flex",
						result.role === "user" ? "justify-end" : "justify-start"
					)}
				>
					<Box
						sx={(theme) => {
							const bgUserInLight = theme.colors.blue[2];
							const bgUserInDark = theme.colors.blue[7];
							const bgBotInLight = theme.colors.gray[2];
							const bgBotInDark = theme.colors.dark[7];
							const colorUserInLight = theme.colors.gray[9];
							const colorUserInDark = theme.colors.gray[0];
							const colorBotInLight = theme.colors.gray[9];
							const colorBotInDark = theme.colors.dark[0];
							return {
								backgroundColor:
									theme.colorScheme === "dark"
										? result.role === "user"
											? bgUserInDark
											: bgBotInDark
										: result.role === "user"
										? bgUserInLight
										: bgBotInLight,
								color:
									theme.colorScheme === "dark"
										? result.role === "user"
											? colorUserInDark
											: colorBotInDark
										: result.role === "user"
										? colorUserInLight
										: colorBotInLight,
							};
						}}
						className={classNames(
							"max-w-[80vw]",
							"px-2 rounded-lg p-2",
							result.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"
						)}
					>
						<MdRenderer result={result.result}>{result.text}</MdRenderer>
					</Box>
				</m.div>
			))}
		</Stack>
	);
}
