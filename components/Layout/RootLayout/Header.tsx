import { Group, Header as Header_, Text } from "@mantine/core";
import ColorSchemeSwitch from "./ColorSchemeSwitch";
import Link from "next/link";

function Logo() {
	return (
		<Link href="/" className="no-underline">
			<Group spacing="xs">
				<Text
					size="xl"
					fw="bold"
					className="select-none"
					sx={(theme) => ({
						color: theme.colorScheme === "dark" ? "white" : "black",
					})}
				>
					Bing Chat
				</Text>
			</Group>
		</Link>
	);
}

export default function Header() {
	return (
		<Header_ height={60} p="xs">
			<Group position="apart">
				<Group>
					<Logo />
				</Group>

				<Group>
					<ColorSchemeSwitch />
				</Group>
			</Group>
		</Header_>
	);
}
