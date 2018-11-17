const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = [
    {
        entry: {
            'server': './src/server/server.ts'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist')
        },
        mode: "development",
        target: 'node',
        watch: true,
        plugins: [
            new NodemonPlugin(),
            new CleanWebpackPlugin(['dist']),
            new CopyWebpackPlugin([
                { from: 'src/server/cert/', to: './cert' }
            ]),
        ],
        externals: {
            uws: "uws"
        },
    },
    {
        entry: {
            'UnknowGame': './src/game/UnknowGame.ts'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist/public')
        },
        mode: "development",
        watch: true,
        plugins: [
            new CopyWebpackPlugin([
                { from: 'src/game/static/', to: './' }
            ]),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'src/game/template/index.html'
            }),
            new WorkboxPlugin.GenerateSW({
                clientsClaim: true,
                skipWaiting: true
            }),
            new Dotenv({
                path: 'src/game/environement/dev.env',
            })
        ]
    }
];