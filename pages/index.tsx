import { getRootLayout } from "@/components/Layout/RootLayout";
import Messages from "@/components/Messages";
import SendBox from "@/components/SendBox";
import { Stack } from "@mantine/core";
import { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
	return (
		<Stack className="container mx-auto p-5 sm:p-1">
			<Messages />

			<SendBox />
		</Stack>
	);
};

Page.getLayout = getRootLayout;

export default Page;
