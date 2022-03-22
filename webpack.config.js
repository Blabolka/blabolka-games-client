const path = require('path')
const Dotenv = require('dotenv-webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (env, arguments) => {
    return {
        entry: path.join(__dirname, 'src', 'index.tsx'),
        devtool: Boolean(arguments.mode === 'development') ? 'inline-source-map' : false,
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js',
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js'],
            roots: [__dirname],
            alias: {
                '@api': path.resolve('src', 'api'),
                '@hooks': path.resolve('src', 'app', 'hooks'),
                '@assets': path.resolve('src', 'assets'),
                '@components': path.resolve('src', 'components'),
                '@pages': path.resolve('src', 'pages'),
                '@services': path.resolve('src', 'services'),
                '@socket': path.resolve('src', 'socket'),
                '@redux-actions': path.resolve('src', 'store', 'actions'),
                '@redux-store': path.resolve('src', 'store'),
                '@entityTypes': path.resolve('src', 'types'),
                '@utils': path.resolve('src', 'utils'),
            }
        },
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
                            plugins: [
                                ['@babel/transform-runtime'],
                            ],
                        },
                    },
                },
                {
                    test: /\.less$/i,
                    use: ['style-loader', 'css-loader', 'less-loader'],
                },
                {
                    test: /\.(png|jp(e*)g|svg|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'img/[hash]-[name].[ext]',
                            },
                        },
                    ],
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({ template: path.join(__dirname, 'public', 'index.html') }),
            new CleanWebpackPlugin(),
            new Dotenv(),
            new CopyPlugin({
                patterns: [{ from: 'public/favicon-controller.svg', to: 'img' }],
            }),
        ],
        devServer: {
            port: 3000,
            static: {
                directory: path.join(__dirname, 'public'),
            },
            compress: true,
            open: true,
            historyApiFallback: true,
        },
    }
}
