const webpack = require('webpack');
const path = require('path');
const resolve = path.resolve;
module.exports = {
    output : {
        filename     : '[name].js',
        library      : 'g',
        libraryTarget: 'umd',
        path         : resolve(__dirname, '../dist/')
    },
    module : {
        rules: [
            {
                test: /\.js$/,
                use : {
                    loader : 'babel-loader',
                    options: {
                        babelrc: true
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin()
    ]
};
