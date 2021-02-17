module.exports = {
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
