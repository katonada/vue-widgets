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
    },
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://127.0.0.1:8070',
            }
        }
    }
};
