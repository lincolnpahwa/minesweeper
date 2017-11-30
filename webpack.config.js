module.exports = {
    entry: "./game/index.js",
    output: {
        path: __dirname,
        filename: "dist/index.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
