import { LazyMotion } from "framer-motion";

const features = () => import("./features").then((res) => res.default);

export default function MotionProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return <LazyMotion features={features}>{children}</LazyMotion>;
}
