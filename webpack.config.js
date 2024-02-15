const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new htmlWebpackPlugin({
            filename: 'contact.html',
            template: './src/contact.html'
        }),
        new htmlWebpackPlugin({
            filename: 'blog.html',
            template: './src/blog.html'
        }),
        new htmlWebpackPlugin({
            filename: 'blog-details.html',
            template: './src/blog-details.html'
        }),
        new htmlWebpackPlugin({
            filename: 'checkout.html',
            template: './src/checkout.html'
        }),
        new htmlWebpackPlugin({
            filename: 'main.html',
            template: './src/main.html'
        }),
        new htmlWebpackPlugin({
            filename: 'product-details.html',
            template: './src/product-details.html'
        }),
        new htmlWebpackPlugin({
            filename: 'shop.html',
            template: './src/shop.html'
        }),
        new htmlWebpackPlugin({
            filename: 'shop-cart.html',
            template: './src/shop-cart.html'
        }),
      
    ]
};