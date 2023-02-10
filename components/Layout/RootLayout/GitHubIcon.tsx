import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars, IconBrandGithub } from "@tabler/icons-react";

export default function GitHubIcon() {
	return (
		<ActionIcon
			variant="outline"
			color="gray"
			title="Toggle color scheme"
			component="a"
			href="https://github.com/Songkeys/bing-chat"
			target="_blank"
		>
			<IconBrandGithub />
		</ActionIcon>
	);
}
