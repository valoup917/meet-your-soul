const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/index.js', // point d'entrée de votre application
    output: {
        path: path.resolve(__dirname, 'dist'), // dossier de sortie
        filename: 'bundle.js', // nom du fichier de sortie
        publicPath: '/',
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        historyApiFallback: true,
        compress: true,
        port: 3000, // Vous pouvez spécifier un port pour éviter des conflits
        open: true, // Ouvre automatiquement le navigateur
    },
    devtool: 'source-map',
    externals: {
        React: 'react',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('tailwindcss'),
                                    require('autoprefixer'),
                                ],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(mp3|wav)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash].[ext]',
                        outputPath: 'assets/sounds/'
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['', '.jsx', '.js', '.json']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "public/index.html",
            filename: "index.html",
            inject: true,
            favicon: "public/favicon.ico",
            manifest: "public/manifest.json",
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public/serviceWorker.js',
                    to: ''
                },
                {
                    from: 'public/manifest.json',
                    to: ''
                },
                {
                    from: 'public/logo192.png',
                    to: ''
                }
            ]
        })
    ]
};