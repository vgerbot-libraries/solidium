import { pkg } from './base.mjs';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (pkg.scripts && pkg.scripts.start) {
    await $`npm start`;
} else {
    if (pkg.scripts && pkg.scripts.prestart) {
        await $`npm run prestart`;
    }
    if (pkg.scripts && pkg.scripts['parallel:start']) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        $`npm run parallel:start`;
    }
    await $`rollup -w -c $ROOT_DIR/rollup.config.js`;
}
