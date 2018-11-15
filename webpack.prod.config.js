const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
            new CleanWebpackPlugin(['dist'])
        ]
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
                { from: 'src/game/static/app.css', to: './' }
            ]),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: 'src/game/static/index.html'
            })
        ]
    }
]