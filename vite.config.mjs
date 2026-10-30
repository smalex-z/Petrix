import { defineConfig } from 'vite';
import { cp } from 'node:fs/promises';
import { resolve } from 'node:path';

// Runtime loaders need stable filenames, including glTF-relative textures/buffers.
export default defineConfig({
  base: './',
  plugins: [{
    name: 'petrix-runtime-assets',
    apply: 'build',
    async writeBundle(options) {
      const output = resolve(options.dir);
      for (const directory of ['images', 'pine-tree', 'stardew_valley_cabin']) {
        await cp(resolve('assets', directory), resolve(output, 'assets', directory), {
          recursive: true,
        });
      }
    },
  }],
});
