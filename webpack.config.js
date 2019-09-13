const path = require('path');

module.exports = {
  entry: './src/index.js',
  resolve: {
      alias: {
          'react': 'preact/compat/dist/compat.js',
          'react-dom': 'preact/compat/dist/compat.js',
          'preact/hooks': 'preact/hooks/dist/hooks.js'
      }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}