import { Text, Dialog } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";

export default function OverloadBanner() {
	const [opened, setOpened] = useState(true);

	return (
		<Dialog
			opened={opened}
			withCloseButton
			onClose={() => setOpened(false)}
			size={300}
			radius="md"
		>
			<IconAlertCircle color="yellow" />
			<Text size="sm" weight={500}>
				Sorry. The account used to run this App is currently banned from
				Microsoft. We may not be able to use this App for now. 😞
			</Text>
		</Dialog>
	);
}
