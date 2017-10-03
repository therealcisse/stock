/**
 * Build config for electron renderer process
 */

import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import merge from 'webpack-merge';
import objectAssign from 'object-assign';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import baseConfig from './webpack.config.base';
import CheckNodeEnv from './internals/scripts/CheckNodeEnv';

CheckNodeEnv('production');

export default merge.smart(baseConfig, {
  devtool: 'source-map',

  target: 'electron-renderer',

  entry: path.join(__dirname, 'app/index.js'),

  output: {
    path: path.join(__dirname, 'app/dist'),
    publicPath: '../dist/',
    filename: 'renderer.prod.js',
  },

  resolve: {
    alias: objectAssign(
      {},
      require('fbjs-scripts/third-party-module-map'),
      require('fbjs/module-map'),
      {
        Store: 'utils/Store',
        Clock: 'utils/Clock',
        validation: 'utils/validation',
        'validation-messages': 'utils/messages/validation-messages',
        countries: 'utils/countries',
        getCurrentUser: 'utils/getCurrentUser',
        dataIdFromObject: 'utils/dataIdFromObject',
        log: 'utils/log',
        AppState: 'utils/AppState',

        'authWrappers/UserIsAuthenticated':
          'utils/auth/authWrappers/UserIsAuthenticated',
        'authWrappers/NotAuthenticated':
          'utils/auth/authWrappers/NotAuthenticated',

        'intl-formats': 'utils/intl-formats',
      },
    ),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: false,
            },
          },
        ],
      },
      {
        test: /\.graphql$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: ['graphql-tag/loader'],
      },
      {
        test: /\.css$/,
        exclude: [],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {},
            },
          ],
        }),
      },
      {
        test: /\.scss$/,
        exclude: [],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                url: false,
                modules: true,
                sourceMap: false,
                minimize: {
                  zindex: false,
                  discardComments: {
                    removeAll: true,
                  },
                  autoprefixer: {
                    add: true,
                    remove: true,
                    browsers: ['last 2 versions'],
                  },
                  discardUnused: false,
                  mergeIdents: false,
                  reduceIdents: false,
                  safe: true,
                  sourceMap: false,
                },
                discardDuplicates: true,
                importLoaders: 2,
                localIdentName: '[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
              query: {
                data: '$env: production;',
                outputStyle: 'expanded',
                includePaths: [
                  path.resolve(__dirname, 'app'),
                  path.resolve(__dirname, 'node_modules'),
                  path.resolve(__dirname, 'app', 'styles'),
                ],
              },
            },
          ],
        }),
      }, // WOFF Font
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff',
          },
        },
      },
      // TTF Font
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream',
          },
        },
      },
      // EOT Font
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader',
      },
      // SVG Font
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml',
          },
        },
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader',
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(['app/dist']),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.DEBUG_PROD': JSON.stringify(
        process.env.DEBUG_PROD || 'false',
      ),
    }),

    new webpack.optimize.ModuleConcatenationPlugin(),

    /**
     * Babli is an ES6+ aware minifier based on the Babel toolchain (beta)
     */
    new UglifyJSPlugin(),

    new ExtractTextPlugin({
      filename: 'styles/style.css',
      ignoreOrder: true,
      allChunks: true,
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true',
    }),
  ],

  stats: 'minimal',
});
