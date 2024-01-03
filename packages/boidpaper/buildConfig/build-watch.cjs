const { context } = require('esbuild');
const coreConfig = require('./core.config.cjs');

(async () => {
    try {
        const buildStep = await context(coreConfig);

        //https://esbuild.github.io/plugins/#svelte-plugin
        if (buildStep.warnings) {
            buildStep.warnings.forEach((warn) => {
                console.log('//-------------------------WARNING---------------------------');
                console.warn(warn);
            });
        }
        await buildStep.watch();
        console.log('----------------------------WATCHING---------------------------');
    } catch (err) {
        console.error('//------------------------------Build error------------------------');
        console.error(JSON.stringify(err, null, 2));
        process.exit(1);
    }
})();
