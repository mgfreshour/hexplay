'use strict';
var path = require('path');
var webpack = require('webpack');

var isProd = false;

module.exports = {
    context: path.join(__dirname, 'client'),
    plugins: [
        //new webpack.optimize.UglifyJsPlugin({minimize: isProd})
    ],
    entry: {
        index: './index.html',
        test: ['./test.js']
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].js',
        sourceMapFilename: '[name].map'
    },
    resolve: {
        root: path.join(__dirname, 'scripts'),
        extensions: ['', '.js', '.json']
    },
    devtool: isProd ? '' : 'source-map',
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'file-loader?name=[path][name].[ext]'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: [/node_modules/, /\.spec\.js/],
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
