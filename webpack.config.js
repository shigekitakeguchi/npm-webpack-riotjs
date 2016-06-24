var webpack = require("webpack");

module.exports = {
  entry: './src/scripts/index.js',
  output: {
    path: __dirname + '/app/scripts',
    filename: 'bundle.js',
		publicPath: '/app/',
  },
  module: {
    preLoaders: [
      {
        test: /\.tag$/,
        exclude: /node_modules/,
        loader: 'riotjs-loader',
        query: {
          type: 'babel'
        }
      }
    ],
    loaders: [
      {
        test: /\.js$|\.tag$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
      extensions: ['', '.js', '.tag']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.ProvidePlugin({
      riot: 'riot'
    })
  ]
}
