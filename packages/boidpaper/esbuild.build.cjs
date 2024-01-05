const { build } = require("esbuild");

(async () => {
  try {
    /**
     * @link https://esbuild.github.io/api/#build
     * @link https://nodejs.org/api/packages.html#nodejs-packagejson-field-definitions
     * @link https://docs.npmjs.com/cli/v10/configuring-npm/package-json
     * @type {import("eslint").build}
     */
    const buildStep = await build({
      //*------------------------ General Opts
      // tsconfig: './tsconfig.json', //? tsconfig is automatically imported but implement if multiple for different env
      bundle: true,
      // platform: 'node', //? https://esbuild.github.io/api/#platform

      //*------------------------ Input
      entryPoints: ["src/index.ts"],
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
    });

    //https://esbuild.github.io/plugins/#svelte-plugin
    if (buildStep.warnings) {
      buildStep.warnings.forEach((warn) => {
        console.warn(warn);
      });
    }
  } catch (err) {
    console.error("//------------------------------Base build error------------------------");
    console.error(JSON.stringify(err, null, 2));
    process.exit(1);
  }
})();
