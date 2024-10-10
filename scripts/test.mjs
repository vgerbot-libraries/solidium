import { pkg, cwd } from './base.mjs';

if (pkg.scripts && pkg.scripts.test) {
    await $`cross-env NODE_ENV=test npm t -- --passWithNoTests`;
} else {
    const JS_CONFIG_PATH = await import.meta.resolve('../jest.config.js');
    process.env.JS_CONFIG_PATH = JS_CONFIG_PATH.replace('file:///', '/');
    await $`cross-env NODE_ENV=test jest -c $JS_CONFIG_PATH --passWithNoTests`;
}
