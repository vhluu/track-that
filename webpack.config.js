const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  resolve: {
      alias: {
          'react': 'preact/compat/dist/compat.js',
          'react-dom': 'preact/compat/dist/compat.js',
          'preact/hooks': 'preact/hooks/dist/hooks.js'
      }
  },
  plugins: [
    new CopyPlugin([
      { from: 'src', to: '', ignore: 'index.js' },
    ]),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
}