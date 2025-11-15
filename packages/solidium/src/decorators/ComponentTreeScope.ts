import { Scope } from '@vgerbot/ioc';

export const COMPONENT_TREE_SCOPE = 'solidium-component-tree-scope';
/**
 * Classes marked with ComponentTreeScope are no longer globally shared singletons,
 * but instead are singletons shared among child components within a component tree.
 */
export const ComponentTreeScope = Scope(COMPONENT_TREE_SCOPE);
