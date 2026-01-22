import type { RouteSectionProps } from "@solidjs/router";

export function Layout(props: RouteSectionProps) {
	return <>{props.children}</>;
}
