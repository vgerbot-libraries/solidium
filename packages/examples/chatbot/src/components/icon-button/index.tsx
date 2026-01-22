import type { ParentProps } from "solid-js";
import "./index.css";

export function IconButton(props: ParentProps) {
	return (
		<button class="icon-button" {...props}>
			{props.children}
		</button>
	);
}
