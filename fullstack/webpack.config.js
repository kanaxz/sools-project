const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var CommonsPlugin = new require("webpack/lib/optimize/CommonsChunkPlugin")

module.exports = {
    entry: "./client/entryPoint",
    devtool: "source-map",
    devServer: {
        proxy: {
            "/apis/auth": "http://localhost:1234",
            '/assets': "http://localhost:1234",
            '/datas': "http://localhost:1234"
        },
        historyApiFallback: true
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: '[name].js',
        chunkFilename: '[name].bundle.js',
        libraryTarget: "amd"
    },
    resolve: {
        modules: [path.resolve(__dirname, "client"), __dirname, "node_modules"]
    },
    module: {

        rules: [{
                test: /\.jpg$/,
                use: ["file-loader"]
            }, {
                test: /\.png$/,
                use: ["url-loader?mimetype=image/png"]
            }, {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader"
                }]
            }/*, {
            	test: /\.js$/,
            	exclude: /(lib)/,
            	use: {
            		loader: 'babel-loader',
            		options: {
            			plugins: [
            				require("babel-plugin-syntax-dynamic-import"),
            				require("babel-plugin-transform-custom-element-classes"),
            				require("babel-plugin-transform-es2015-classes")
            			]
            		}
            	}
            }/**/
            , {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader'
                }
            }
        ]
    },
    plugins: [new CopyWebpackPlugin([{
        from: 'client/lib',
        to: 'lib'
    }, {
        from: 'client/index.html',
        to: 'index.html'
    }])]
}