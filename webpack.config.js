const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './index.web.ts',
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
    },
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js', '.json', '.web.jsx', '.jsx'],
    fallback: {
      'path': false,
      'fs': false,
    },
    fullySpecified: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'App.web.tsx'),
          path.resolve(__dirname, 'index.web.ts'),
          /node_modules\/@react-navigation/,
          /node_modules\/react-native-gesture-handler/,
          /node_modules\/@react-native-masked-view/,
        ],
        use: {
          loader: 'babel-loader',
          options: {
            configFile: './babel.config.web.js',
          },
        },
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/',
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true,
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'public'),
    port: 3001,
    open: true,
    historyApiFallback: true,
  },
  experiments: {
    topLevelAwait: true,
  },
};