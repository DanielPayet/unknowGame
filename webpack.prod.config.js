const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = [
    {
        entry: './src/server/server.ts',
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
            filename: 'server.js',
            path: path.resolve(__dirname, 'dist')
        },
        mode: "production",
        target: 'node',
        plugins: [
            new CleanWebpackPlugin(['dist']),
            new CopyWebpackPlugin([
                { from: 'src/server/cert/', to: './cert' }
            ]),
        ],
        externals: {
            uws: "uws"
        }
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
        mode: "production",
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
            })
        ]
    }
]