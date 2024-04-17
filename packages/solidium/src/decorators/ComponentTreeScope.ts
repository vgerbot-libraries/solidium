import { Scope } from '@vgerbot/ioc';

export const COMPONENT_TREE_SCOPE = 'solidium-component-tree-scope';
/**
 * 标记为 ComponentTreeScoped 的类，其不再是全局共享单实例，而是子组件共享单实例
 */
export const ComponentTreeScope = Scope(COMPONENT_TREE_SCOPE);
