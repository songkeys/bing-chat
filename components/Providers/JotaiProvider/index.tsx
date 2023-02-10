import { Provider } from "jotai";

export default function JotaiProvider({ children }: React.PropsWithChildren) {
	return <Provider>{children}</Provider>;
}
