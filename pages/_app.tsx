import { AppProps } from "next/app";
import Head from "next/head";
import Providers from "@/components/Providers";
import { NextPage } from "next";
import { DefaultSeo } from "next-seo";
import { ReactElement, ReactNode } from "react";
import "@/styles/globals.css";

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
	P,
	IP
> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const App = (props: AppPropsWithLayout) => {
	const { Component, pageProps } = props;

	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<>
			<Head>
				<title>Bing Chat</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
				<meta name="description" content="Chat with Bing" />
				<link rel="shortcut icon" href="/favicon.ico" />

				<DefaultSeo
					openGraph={{
						type: "website",
						url: "https://bing-chat.vercel.app/",
						siteName: "Bing Chat",
						description: "Chat with Bing",
						images: [
							{
								url: "https://bing-chat.vercel.app/og.jpg",
								height: 630,
								width: 1200,
								alt: "Bing Chat",
							},
						],
					}}
				/>
			</Head>

			<Providers>{getLayout(<Component {...pageProps} />)}</Providers>
		</>
	);
};

export default App;
