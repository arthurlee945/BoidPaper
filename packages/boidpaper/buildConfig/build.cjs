const { build } = require('esbuild');
const coreConfig = require('./core.config.cjs');

(async () => {
    try {
        const buildStep = await build(coreConfig);

        //https://esbuild.github.io/plugins/#svelte-plugin
        if (buildStep.warnings) {
            buildStep.warnings.forEach((warn) => {
                console.warn(warning);
            });
        }
    } catch (err) {
        console.error('//------------------------------Base build error------------------------');
        console.error(JSON.stringify(err, null, 2));
        process.exit(1);
    }
})();
