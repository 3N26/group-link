import { join } from 'path';
import manifest from '../src/manifest';

const srcDir = join(import.meta.dir, '..', 'src');
const assetsDir = join(srcDir, 'assets');

const outputDir = 'dist/group-link';

export async function build() {
  await Bun.build({
    entrypoints: [
      join(srcDir, 'popup', 'index.ts'),
      join(srcDir, 'content', 'index.ts'),
      join(srcDir, 'background', 'index.ts'),
    ],
    outdir: outputDir,
    minify: true,
  });
  await buildMainfest();
}

async function buildMainfest() {
  const file = Bun.file(join(outputDir, 'manifest.json'));
  const data = JSON.stringify(manifest, null, 2);
  await Bun.write(file, data);
  // todo opt
  // await Bun.write(
  //   join(outputDir, 'icon-34.png'),
  //   Bun.file(join(assetsDir, 'icon-34.png'))
  // );
  await Bun.write(
    join(outputDir, 'icon-128.png'),
    Bun.file(join(assetsDir, 'icon-128.png'))
  );
  await Bun.write(
    join(outputDir, 'popup', 'index.html'),
    Bun.file(join(srcDir, 'popup', 'index.html'))
  );
}

await build();
