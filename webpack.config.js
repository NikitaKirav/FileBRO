const path = require('path');
const bundleFolder = "./KiravRu/wwwroot/bundle/";
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
    const config = {};

    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config;
};

module.exports = {
    entry: {
        main: ['@babel/polyfill', './KiravRu/Scripts/main.js'],
    },
    output: {
        filename: 'script.js',
        path: path.resolve(__dirname, bundleFolder),
    },
    devtool: isDev ? 'source-map' : '',
    optimization: optimization(),
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'style.css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {                    
                    presets: [
                        '@babel/preset-env'
                    ]
                }
            },
            {
                test: /\.(png|jpg|svg|giv)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: './images/',
                            useRelativePath: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true
                        },

                    }, 'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true
                        },

                    }, "css-loader", 
                    'less-loader'
                ]
            },
        ]
    }
};
