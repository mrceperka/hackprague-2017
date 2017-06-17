var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: [
    "react-hot-loader/patch",
    // activate HMR for React

    "webpack-dev-server/client?http://localhost:3000",
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    "webpack/hot/only-dev-server",
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

    "./src/index.js"
    // the entry point of our app
  ],

  output: {
    filename: "bundle.js",
    // the output bundle

    path: path.resolve(__dirname, "dist"),

    publicPath: "/static/"
    // necessary for HMR to know where to load the hot update chunks
  },

  devtool: "inline-source-map",

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ["babel-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader: "css-loader" // translates CSS into CommonJS
          },
          {
            loader: "less-loader" // compiles Less to CSS
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader" // creates style nodes from JS strings
          },
          {
            loader:
              "css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]" // translates CSS into CommonJS
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: "file-loader?name=dist/fonts/[name].[ext]"
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new webpack.NoEmitOnErrorsPlugin()
    // do not emit compiled assets that include errors
  ],

  devServer: {
    host: "localhost",
    port: 3000,

    historyApiFallback: true,
    // respond to 404s with index.html

    hot: true
    // enable HMR on the server
  }
};
