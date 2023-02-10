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
	Stack,
	Box,
	Group,
} from "@mantine/core";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
// @ts-ignore
import remarkSuper from "./lib/remark-super";

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
			className="break-normal overflow-hidden"
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
							className="break-words m-0"
							style={{ wordBreak: "break-word" }}
							{...props}
						/>
					);
				},
				span: ({ node, ...props }) => {
					return (
						<Text
							component="span"
							className="break-words m-0"
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
				// li: ({ node, ...props }) => {
				// 	return (
				// 		<List.Item>
				// 			{props.children}
				// 		</List.Item>
				// 	);
				// },
				mark: ({ node, ...props }) => {
					return <Mark>{props.children}</Mark>;
				},
				hr: ({ node, ...props }) => {
					return <Divider />;
				},
				sup: ({ node, ...props }) => {
					const id = props.children.toString();
					const index = parseInt(id, 10) - 1;
					const source = sourceAttributions[index];
					const badge = (
						<sup className="cursor-pointer">
							<Text
								component="a"
								size="sm"
								target="_blank"
								rel="noopener noreferrer"
								href={source?.seeMoreUrl}
								sx={(theme) => ({
									backgroundColor:
										theme.colorScheme === "dark"
											? theme.colors.blue[9]
											: theme.colors.blue[2],
								})}
								className="px-1 font-semibold"
								inline
							>
								{id}
							</Text>
						</sup>
					);

					if (!source) {
						return badge;
					}
					return (
						<HoverCard
							closeDelay={500}
							withinPortal
							classNames={{
								dropdown: "max-w-[180px]",
							}}
						>
							<HoverCard.Target>{badge}</HoverCard.Target>
							<HoverCard.Dropdown>
								<Group>
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

									<Anchor
										href={source.seeMoreUrl}
										size="sm"
										target="_blank"
										rel="noopener noreferrer"
									>
										{source.imageFavicon && (
											<Image
												className="inline-block align-middle mr-2"
												width={16}
												height={16}
												src={`data:image/png;base64,${source.imageFavicon}`}
												alt={
													source.providerDisplayName ||
													"Search: " + source.searchQuery
												}
											/>
										)}
										{source.providerDisplayName ||
											"Search: " + source.searchQuery}
									</Anchor>
								</Group>
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
