import {
	MantineProvider,
	createEmotionCache,
	ColorScheme,
	ColorSchemeProvider,
} from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import React, { PropsWithChildren } from "react";

export const emotionCache = createEmotionCache({
	key: "mantine",
	prepend: false, // https://github.com/mantinedev/mantine/issues/823#issuecomment-1065833889
});

export default function ThemeProvider({ children }: PropsWithChildren) {
	const preferredColorScheme = useColorScheme();
	const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
		key: "mantine-color-scheme",
		defaultValue: preferredColorScheme,
		getInitialValueInEffect: true,
	});
	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}
		>
			<MantineProvider
				withCSSVariables
				withGlobalStyles
				withNormalizeCSS
				emotionCache={emotionCache}
				theme={{
					/** Put your mantine theme override here */
					colorScheme,
					white: "#fff",
					black: "#0f1419",
				}}
			>
				{children}
			</MantineProvider>
		</ColorSchemeProvider>
	);
}
