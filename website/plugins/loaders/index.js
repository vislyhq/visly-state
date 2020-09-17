module.exports = function (context, options) {
    return {
        name: 'loaders',
        configureWebpack(config, isServer) {
            return {
                module: {
                    rules: [
                        {
                            test: /\.css$/i,
                            use: ['style-loader', 'css-loader'],
                        },
                    ],
                },
            }
        },
    }
}
