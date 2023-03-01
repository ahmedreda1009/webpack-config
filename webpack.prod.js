const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const common = require("./webpack.common");
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const HtmlWebpackPlugin = require('html-webpack-plugin');

// handle multiple html pages.
let htmlPageNames = ['home', 'profile'];
let multipleHtmlPlugins = htmlPageNames.map(name => {
    return new HtmlWebpackPlugin({
        template: `./src/pages/${name}.html`, // relative path to the HTML files
        filename: `${name}.html`, // output HTML files
        chunks: [`${name}`] // respective JS files
    })
});

module.exports = merge(common, {
    mode: "production",
    output: {
        filename: '[name]-[contenthash].bundle.js',
        path: path.resolve(__dirname, 'build'),
        assetModuleFilename: 'assets/[name]-[hash][ext][query]'
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: "[name]-[contenthash].css" }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // extract css into files
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            }
        ]
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
            new HtmlWebpackPlugin({
                template: './src/index.html',
                minify: {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    removeComments: true
                }
            })
        ].concat(multipleHtmlPlugins),
    },
});