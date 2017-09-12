/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import chalk from 'chalk';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import { dependencies as externals } from './app/package.json';

export default {
  externals: Object.keys(externals || {}),

  output: {
    path: path.join(__dirname, 'app'),
    filename: 'renderer.dev.js',
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.json'],
    modules: [
      path.resolve(__dirname, 'app'),
      path.resolve(__dirname, 'node_modules'),
    ],
  },

  plugins: [
    // Progress bar + options
    new ProgressBarPlugin({
      format: ` ${chalk.magenta.bold('APP')} building [:bar] ${chalk.green.bold(
        ':percent',
      )} (:elapsed seconds)`,
    }),

    new webpack.NamedModulesPlugin(),
  ],
};
