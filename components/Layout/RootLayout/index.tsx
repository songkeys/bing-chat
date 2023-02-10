import { AppShell } from "@mantine/core";
import { ReactElement } from "react";
import Header from "./Header";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AppShell
			padding="md"
			header={<Header />}
			styles={(theme) => ({
				main: {
					backgroundColor:
						theme.colorScheme === "dark"
							? theme.colors.dark[8]
							: theme.colors.gray[0],
				},
			})}
		>
			{children}
		</AppShell>
	);
}

export const getRootLayout = (page: ReactElement) => (
	<RootLayout>{page}</RootLayout>
);
