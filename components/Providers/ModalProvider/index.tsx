import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

export default function ModalProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return <ModalsProvider>{children}</ModalsProvider>;
}
