import { readdir, rm } from 'node:fs/promises';

const publicDemoDirectory = new URL('../dist/demo/', import.meta.url);
for (const entry of await readdir(publicDemoDirectory, { withFileTypes: true })) {
  if (entry.name !== 'studio') {
    await rm(new URL(`${entry.name}/`, publicDemoDirectory), { force: true, recursive: true });
  }
}
