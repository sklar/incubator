/**
 * Webpack config
 */

const path = require('path');
// const webpack = require('webpack');

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { CleanWebpackPlugin: CleanPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const WebConfig = require('./website.config');

module.exports = (env) => {
    const isProduction =
        process.env.NODE_ENV === 'production' || (!!env && env.production);

    return {
        //
        devServer: {
            compress: false,
            contentBase: path.join(__dirname, 'public'),
            overlay: {
                errors: true,
                warnings: true,
            },
            port: 9000,
            stats: {
                children: false,
                colors: true,
                modules: false,
                moduleTrace: false,
            },
            watchContentBase: true,
            watchOptions: {
                aggregateTimeout: 800,
                poll: true,
            },
        },

        //
        devtool: 'cheap-source-map',

        //
        entry: {
            vendors: [
                path.resolve(
                    __dirname,
                    'node_modules/normalize.css/normalize.css'
                ),
            ],
            main: [
                path.resolve(__dirname, 'src/assets/stylesheets/main.scss'),
                path.resolve(__dirname, 'src/assets/scripts/main.js'),
            ],
        },

        //
        mode: isProduction ? 'production' : 'development',

        //
        module: {
            rules: [
                // Images
                // {
                //     test: /\.(gif|jpe?g|png|svg)$/,
                //     use: [
                //         {
                //             loader: 'file-loader',
                //             options: {
                //                 name: isProduction
                //                     ? 'images/[name]-[hash:8].[ext]'
                //                     : 'images/[name].[ext]',
                //             },
                //         },
                //     ],
                // },

                // Pug
                {
                    test: /\.pug$/,
                    use: [
                        {
                            loader: 'pug-loader',
                        },
                    ],
                },

                // Javascript
                // {
                //     test: /\.js$/,
                //     exclude: /node_modules/,
                //     use: [
                //         {
                //             loader: 'eslint-loader',
                //         },
                //     ],
                // },

                // Stylesheets
                {
                    test: /\.(s)?css$/,
                    use: [
                        CssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                // importLoaders: 0,
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                // includePaths: [
                                //     path.resolve(__dirname, 'node_modules/superpackage')
                                // ],
                                sourceMap: true,
                            },
                        },
                    ],
                },
            ],
        },

        //
        output: {
            // chunkFilename: isProduction ?
            //     'scripts/[id].[name]-[contenthash:8].js' :
            //     'scripts/[id].[name].js',

            filename: isProduction
                ? 'scripts/[name]-[contenthash:8].js'
                : 'scripts/[name].js',

            path: path.resolve(__dirname, 'public'),

            publicPath: '/',
        },

        //
        plugins: [
            // Runs BrowserSync.
            new BrowserSyncPlugin({
                files: ['public/*.html'],
                proxy: 'http://localhost:9000/',
                reloadDelay: 200,
                reloadDebounce: 600,
            }),

            // Cleans-up build folders.
            // @see https://github.com/johnagan/clean-webpack-plugin
            new CleanPlugin({
                cleanOnceBeforeBuildPatterns: ['public/**/*.*'],
                dry: !isProduction,
            }),

            // Copies individual files or entire directories.
            // @see https://github.com/webpack-contrib/copy-webpack-plugin
            new CopyPlugin(
                [
                    // {
                    //     from: 'icons/*',
                    // },
                    // {
                    //     from: 'images/*.svg',
                    //     to: isProduction
                    //         ? 'images/[name]-[hash:8].[ext]'
                    //         : 'images/[name].[ext]',
                    //     toType: 'template',
                    // },
                    {
                        from: '*.txt',
                        flatten: true,
                    },
                ],
                {
                    context: 'src/assets',
                    copyUnmodified: true,
                }
            ),

            // Extracts styles.
            // @see https://github.com/webpack-contrib/mini-css-extract-plugin
            new CssExtractPlugin({
                filename: isProduction
                    ? 'stylesheets/[name]-[contenthash:8].css'
                    : 'stylesheets/[name].css',
            }),

            // Cretes HTML file(s).
            // @see https://github.com/jantimon/html-webpack-plugin
            new HtmlPlugin({
                inject: false,
                template: path.resolve(__dirname, 'src/index.pug'),
                webConfig: WebConfig,
            }),
        ],

        //
        stats: {
            children: false,
            colors: true,
            modules: false,
            moduleTrace: false,
        },
    };
};
