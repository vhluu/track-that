const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    calendar: './src/js/calendar.js',
    popup: './src/js/popup.js'
  },
  resolve: {
      alias: {
          'react': 'preact/compat/dist/compat.js',
          'react-dom': 'preact/compat/dist/compat.js',
          'preact/hooks': 'preact/hooks/dist/hooks.js'
      }
  },
  plugins: [
    new CopyPlugin([
      { from: 'src', to: '', ignore: ['js/*', 'index.js'] },
      { from: 'src/js/firebase.js', to: 'js' }
    ]),
  ],
  output: {
    filename: 'js/[name].min.js',
    chunkFilename: 'js/[name].min.js',
    path: path.resolve(__dirname, 'dist')
  },
  watch: true
}