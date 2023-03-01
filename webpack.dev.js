const path = require('path');
const common = require("./webpack.common");
const { merge } = require('webpack-merge');
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
    mode: "development",
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build'),
        assetModuleFilename: 'assets/[name]-[hash][ext][query]'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings => inject styles into dom
                    "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' })
    ].concat(multipleHtmlPlugins)
    ,
    devtool: 'source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'build'),
        },
        port: 1009,
        open: true
    }
});

