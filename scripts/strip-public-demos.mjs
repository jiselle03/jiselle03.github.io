import { rm } from 'node:fs/promises';

await rm(new URL('../dist/demo', import.meta.url), { force: true, recursive: true });
