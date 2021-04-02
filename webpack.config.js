const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => ({
  entry: {
    index: './src/index.js',
    popup: './src/js/popup/index.js',
    background: './src/js/background.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'], // use: ['babel-loader', 'eslint-loader'],  
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  plugins: [
    new CopyPlugin([
      { from: 'src', to: '', ignore: ['*.js', '*.scss'] },
    ]),
  ],
  output: {
    filename: 'js/[name].min.js',
    chunkFilename: 'js/[name].min.js',
    path: path.resolve(__dirname, 'build'),
  },
  watch: argv.mode === 'development',
  devtool: (argv.mode === 'development') ? 'cheap-module-source-map' : false
});
