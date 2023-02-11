import { visit } from "unist-util-visit";

// match "[^word^]"
const REGEX = /\[\^[^\d]+\^\]/g;

// refer to https://github.com/rhysd/remark-emoji
export default function remarkSuper() {
	function transformer(ast: any) {
		// refer to https://www.ryanfiller.com/blog/remark-and-rehype-plugins
		visit(ast, "text", (node) => {
			if (REGEX.test(node.value)) {
				const newValue = node.value.replace(REGEX, (match: any) => {
					return "<sup>" + match.substring(2, match.length - 2) + "</sup>";
				});
				Object.assign(node, { type: "html", value: newValue });
			}
		});
	}

	return transformer;
}
