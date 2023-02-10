import { ResponseMessage } from "@/utils/example";
import {
	Title,
	Text,
	Table,
	Blockquote,
	Code,
	Divider,
	List,
	Mark,
	HoverCard,
	Image,
	Anchor,
	Group,
	Stack,
} from "@mantine/core";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
// @ts-ignore
import remarkSuper from "remark-super";

export default function MdRenderer({
	children,
	result,
}: {
	children: string;
	result?: ResponseMessage;
}) {
	const sourceAttributions = result?.details?.sourceAttributions ?? [];

	return (
		<ReactMarkdown
			components={{
				h1: ({ node, ...props }) => <Title order={1} {...props} />,
				h2: ({ node, ...props }) => <Title order={2} {...props} />,
				h3: ({ node, ...props }) => <Title order={3} {...props} />,
				h4: ({ node, ...props }) => <Title order={4} {...props} />,
				h5: ({ node, ...props }) => <Title order={5} {...props} />,
				h6: ({ node, ...props }) => <Title order={6} {...props} />,
				p: ({ node, ...props }) => {
					return (
						<Text
							component="p"
							className="my-2 break-words"
							style={{ wordBreak: "break-word" }}
							{...props}
						/>
					);
				},
				table: ({ node, ...props }) => {
					return (
						<Table striped highlightOnHover>
							{props.children}
						</Table>
					);
				},
				blockquote: ({ node, ...props }) => {
					return <Blockquote>{props.children}</Blockquote>;
				},
				code: ({ node, ...props }) => {
					return <Code>{props.children}</Code>;
				},
				pre: function Pre({ node, ...props }) {
					return (
						<Code block className="overflow-auto">
							{props.children}
						</Code>
					);
				},
				ol: ({ node, ...props }) => {
					return (
						<List
							type="ordered"
							withPadding
							className="list-outside"
							classNames={{ itemWrapper: "block break-normal" }}
						>
							{props.children}
						</List>
					);
				},
				ul: ({ node, ...props }) => {
					return (
						<List
							type="unordered"
							withPadding
							className="list-outside"
							classNames={{ itemWrapper: "block break-normal" }}
						>
							{props.children}
						</List>
					);
				},
				li: ({ node, ...props }) => {
					return <List.Item>{props.children}</List.Item>;
				},
				mark: ({ node, ...props }) => {
					return <Mark>{props.children}</Mark>;
				},
				hr: ({ node, ...props }) => {
					return <Divider />;
				},
				sup: ({ node, ...props }) => {
					console.log(sourceAttributions);
					const id = props.children.toString();
					const index = parseInt(id, 10);
					const source = sourceAttributions[index];
					if (!source) {
						return <sup>{id}</sup>;
					}
					return (
						<HoverCard
							closeDelay={500}
							withinPortal
							classNames={{
								dropdown: "max-w-[180px]",
							}}
						>
							<HoverCard.Target>
								<sup className="cursor-pointer">{id}</sup>
							</HoverCard.Target>
							<HoverCard.Dropdown>
								<Stack align="left">
									{source.imageLink && (
										<Stack>
											<Image
												width={150}
												height={150}
												radius="md"
												src={source.imageLink}
												withPlaceholder
												alt={source.providerDisplayName}
											/>
										</Stack>
									)}

									<div className="flex items-center space-x-2">
										{source.imageFavicon && (
											<Image
												width={16}
												height={16}
												src={`data:image/png;base64,${source.imageFavicon}`}
												alt={
													source.providerDisplayName ||
													"Search: " + source.searchQuery
												}
											/>
										)}
										<Anchor
											href={source.seeMoreUrl}
											size="sm"
											target="_blank"
											rel="noopener noreferrer"
										>
											{source.providerDisplayName ||
												"Search: " + source.searchQuery}
										</Anchor>
									</div>
								</Stack>
							</HoverCard.Dropdown>
						</HoverCard>
					);
				},
			}}
			remarkPlugins={[remarkGfm, remarkSuper]}
			rehypePlugins={[rehypeRaw]}
		>
			{children}
		</ReactMarkdown>
	);
}
