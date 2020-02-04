const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
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
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  plugins: [
    new CopyPlugin([
      { from: 'src', to: '', ignore: ['js/*', 'components/**/*', 'index.js'] },
    ]),
  ],
  output: {
    filename: 'js/[name].min.js',
    chunkFilename: 'js/[name].min.js',
    path: path.resolve(__dirname, 'dist'),
  },
  watch: true,
};
