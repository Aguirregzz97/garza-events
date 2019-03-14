const path = require('path');
const merge = require('webpack-merge')
const common = require('./common.js')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const saveLicense = require('uglify-save-license')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const paths = {
  DIST: path.join(__dirname, '..', '..', 'dist'),
  SRC: path.join(__dirname, '..', '..', 'src')
}

module.exports = merge.smartStrategy({
  plugins: 'append'
})(common(), {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        include: /\.min\.js$/,
        sourceMap: true,
        uglifyOptions: {
          mangle: {
            ie8: false
          },
          output:{
            comments: saveLicense
          },
          compress: {
            booleans: true,
            comparisons: true,
            conditionals: true,
            dead_code: true,
            drop_console: false,
            evaluate: true,
            hoist_funs: true,
            if_return: true,
            inline: false,
            join_vars: true,
            loops: true,
            pure_getters: true,
            sequences: true,
            side_effects  : true,
            unused: true,
            warnings: false
          }
        }
      })
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      '__IsLocal__': false,
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash].css',
      chunkFilename: '[id]_[contenthash].css'
    }),
    // Get full error detail for errors caught by windows.onerror (https://blog.sentry.io/2016/05/17/what-is-script-error.html)
    // More info: https://webpack.github.io/docs/configuration.html#output-crossoriginloading
    // https://reactjs.org/docs/cross-origin-errors.html
    new ScriptExtHtmlWebpackPlugin({
      custom: [
        {
          test: /\.js$/,
          attribute: 'crossorigin',
          value: 'anonymous'
        }
      ]
    })
  ],
  devtool: 'source-map',
  output: {
    filename: '[name]_[contenthash].min.js',
    path: paths.DIST,
    // publicPath: 'https://jorgewebdeploymentakamai.azureedge.net/etisysonline/', // Akamai CDN
    publicPath: 'https://jorgewebdeployment.azureedge.net/etisysonline/', // Microsoft CDN
  },
  module: {
    rules: [{
      test: /\.s?css$/,
      use: [
        MiniCssExtractPlugin.loader,
        { loader: 'css-loader', options: { importLoaders: 1 } },
        'postcss-loader'
      ],
    },
    {
      test: /\.(jpe?g|png|gif|svg|ttf|woff|woff2|eot|ico)$/i,
      loaders: [
        'file-loader?name=asset/[name].[ext]?h=[hash]', // No hash here since we don't update often
        // 'image-webpack-loader?optipng.optimizationLevel=7&gifsicle.interlaced=false', // Turn off image optimization
      ],
    }]
  }
});