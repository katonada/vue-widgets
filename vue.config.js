module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    publicPath: '',
    configureWebpack: {
        optimization: {
            splitChunks: false
        },
        output: {
            filename: '[name].js',
            chunkFilename: '[name].js'
        }
    },
    css: {
        extract: false,
    }
};
