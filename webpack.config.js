'use strict';
var path = require('path');

var isProd = false;

module.exports = {
    context: path.join(__dirname, 'client'),
    devtool: isProd ? '' : 'source-map',
    plugins: [
        //new webpack.optimize.UglifyJsPlugin({minimize: isProd})
    ],
    entry: {
        index: './index.html',
        app: './app.ts',
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].js',
        sourceMapFilename: '[name].map',
    },
    resolve: {
        root: path.join(__dirname, 'scripts'),
        extensions: ['', '.ts', '.js', '.json'],
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' },
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.html$/, loader: 'file-loader?name=[path][name].[ext]' },
        ],
    },
};
