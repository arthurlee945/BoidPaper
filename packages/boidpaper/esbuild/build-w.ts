import { context } from "esbuild";

import { coreConfig } from "./core.config";

try {
  const buildStep = await context(coreConfig);

  await buildStep.watch();
  console.log("----------------------------WATCHING---------------------------");
} catch (err) {
  console.error("//------------------------------Build error------------------------");
  console.error(JSON.stringify(err, null, 2));
  process.exit(1);
}
