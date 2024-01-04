import { resolve } from "path";

import { type BuildOptions } from "esbuild";

export const coreConfig = {
  //*------------------------ General Opts
  // tsconfig: './tsconfig.json', //? tsconfig is automatically imported but implement if multiple for different env
  bundle: false,
  // platform: 'node', //? https://esbuild.github.io/api/#platform

  //*------------------------ Input
  entryPoints: [resolve(__dirname, "../src/index.ts")],
  // loader: {
  //   ".ts": "ts",
  //   ".tsx": "tsx",
  //   ".json": "copy",
  //   ".png": "file",
  //   ".jpg": "file",
  //   ".jpeg": "file",
  //   ".svg": "file",
  // },

  //*------------------------ Output Contents
  //format: "esm",
  //splitting:true //!experiemental (bugged) https://esbuild.github.io/api/#splitting

  //*------------------------ Output Location
  // outbase: 'src',
  outdir: "dist",

  //*------------------------ Path Resolution
  // external: [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})],
  //preserveSymlinks: true, // might need

  //*------------------------ Transformation
  jsx: "automatic", // React Specific

  //*------------------------ Optimization
  // minifyWhitespace: true,
  // minifySyntax: true, // might not want

  //*------------------------ Source Maps
  sourcemap: "linked",

  //*------------------------ Build Metadata
  metafile: true,

  //*------------------------ Logger
  logLimit: 0,
} satisfies BuildOptions;
