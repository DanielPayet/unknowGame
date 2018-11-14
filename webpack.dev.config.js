const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './src/server.ts',
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
    watch: true,
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/public', to: 'public' }
        ]),
        new NodemonPlugin(),
        new CleanWebpackPlugin(['dist'])
    ]
};