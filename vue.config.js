module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    publicPath: '',
    configureWebpack: {
        optimization: {
            // splitChunks: false
        },
        output: {
            filename: '[name].js',
            chunkFilename: '[name].js'
        }
    },
    css: {
        extract: false,
    },
    devServer: {
        port: process.env.PORT,
        proxy: `http://127.0.0.1:${process.env.SERVER_PORT}`
    }
};
