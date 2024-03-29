import { build } from "esbuild";

import { coreConfig } from "./core.config";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    const buildStep = await build(coreConfig);

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
