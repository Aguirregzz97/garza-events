const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = env => {
  return {
    entry: {
      polyfills: [
        '@babel/polyfill',
        'whatwg-fetch'
      ],
      etisys: './src/index.tsx'
    },
    plugins: [
      // Run the bundle analyzer on every build
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false
      }),

      // HTML entries
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),

      // Service worker setup
      new WorkboxPlugin.GenerateSW({
        // these options encourage the ServiceWorkers to get in there fast 
        // and not allow any straggling "old" SWs to hang around
        clientsClaim: true,
        skipWaiting: true,
        exclude: /.*/,
        runtimeCaching: [
          // Found that this isn't really needed if you're setting cache control headers properly
          // Note that locally, this is still needed (since we don't cache any chunks locally), but in PROD, this isn't needed
          // {
          //   urlPattern: /^.*\.(js|html|jpe?g|png|gif|svg|ttf|woff|woff2|eot)$/,
          //   handler: 'networkFirst'
          // },
          {
            // Cache everything at root or "/", ignore query params
            urlPattern: /^https?:\/\/[^\/]+\/?((\#|\?).*)?$/,
            // urlPattern: /^https?:\/\/[^\/]+?\/?$/,
            handler: 'networkFirst'
          }
        ]
      })
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          enforce: 'pre',
          loader: 'tslint-loader',
          options: {
            failOnHint: true
          },
          exclude: [
            /node_modules/,
            /temp_node_modules/,
            /local/,
            /localization/,
            /shared/
          ]
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            'awesome-typescript-loader'
          ]
        }
      ]
    },
    devServer: {
      // These are to allow for development in https://www.onenote.com/stickynotes?localDevOverride=...
      historyApiFallback: true,
      allowedHosts: [
        '*'
      ],
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Expose-Headers': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    }
  }
};