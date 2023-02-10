import JotaiProvider from "./JotaiProvider";
import ModalProvider from "./ModalProvider";
import MotionProvider from "./MotionProvider";
import NotificationProvider from "./NotificationProvider";
import ThemeProvider from "./ThemeProvider";

export default function Providers({ children }: React.PropsWithChildren) {
	return (
		<MotionProvider>
			<JotaiProvider>
				<ThemeProvider>
					<ModalProvider>
						<NotificationProvider>{children}</NotificationProvider>
					</ModalProvider>
				</ThemeProvider>
			</JotaiProvider>
		</MotionProvider>
	);
}
