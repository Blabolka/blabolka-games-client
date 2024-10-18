const path = require('path')
const Dotenv = require('dotenv-webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, arguments) => {
    return {
        entry: path.join(__dirname, 'src', 'index.tsx'),
        devtool: Boolean(arguments.mode === 'development') ? 'inline-source-map' : false,
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[contenthash].js',
            chunkFilename: '[name].[chunkhash].js',
            assetModuleFilename: 'img/[name]-[hash][ext][query]',
            publicPath: '/',
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            roots: [__dirname],
            alias: {
                '@api': path.resolve('src', 'api'),
                '@assets': path.resolve('src', 'assets'),
                '@components': path.resolve('src', 'components'),
                '@hooks': path.resolve('src', 'hooks'),
                '@lib': path.resolve('src', 'lib'),
                '@pages': path.resolve('src', 'pages'),
                '@services': path.resolve('src', 'services'),
                '@redux-actions': path.resolve('src', 'store', 'actions'),
                '@redux-selectors': path.resolve('src', 'store', 'selectors'),
                '@redux-store': path.resolve('src', 'store'),
                '@entityTypes': path.resolve('src', 'types'),
                '@utils': path.resolve('src', 'utils'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            cacheDirectory: true,
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        corejs: { version: 3 },
                                        useBuiltIns: 'entry',
                                        targets: {
                                            edge: '17',
                                            firefox: '60',
                                            chrome: '67',
                                            safari: '11.1',
                                            ie: '11',
                                        },
                                    },
                                ],
                                '@babel/preset-react',
                                '@babel/preset-typescript',
                            ],
                            plugins: [
                                ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
                                ['@babel/plugin-proposal-class-properties'],
                                ['@babel/transform-runtime'],
                            ],
                        },
                    },
                },
                {
                    test: /\.less$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
                },
                {
                    test: /\.(png|jp(e*)g|gif|svg)$/i,
                    type: 'asset/inline',
                    include: /src\/assets\/img\/inline\//,
                },
                {
                    test: /\.(png|jp(e*)g|gif|svg)$/i,
                    type: 'asset/resource',
                    exclude: /src\/assets\/img\/inline\//
                },
            ],
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                },
            },
        },
        plugins: [
            new HtmlWebpackPlugin({ template: path.join(__dirname, 'public', 'index.html') }),
            new MiniCssExtractPlugin({
                filename: 'app.min.css',
            }),
            new CleanWebpackPlugin(),
            new Dotenv(),
            new CopyPlugin({
                patterns: [{ from: 'public/favicon-controller.svg', to: 'img' }, { from: 'public/_redirects' }],
            }),
        ],
        devServer: {
            port: 3000,
            open: true,
            compress: true,
            historyApiFallback: true,
            static: {
                directory: path.join(__dirname, 'public'),
            },
        },
    }
}
