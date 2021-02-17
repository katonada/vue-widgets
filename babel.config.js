module.exports = {
    presets: [
        [
            '@vue/cli-plugin-babel/preset',
            {
                // VUE_CLI_MODERN_BUILD is set to Boolean true by default if "--modern" flag is used on app build. Since we use --modern flag it will allways be true! https://cli.vuejs.org/guide/browser-compatibility.html#modern-mode
                useBuiltIns: process.env.VUE_CLI_MODERN_BUILD ? false : 'usage'
            }
        ]
    ],
};
