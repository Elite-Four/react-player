module.exports = {
  entry: './src/Player.jsx',
  output: {
    filename: './dist/Player.js',
    library: 'Player'
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        optional: ['runtime'],
        stage: 0
      }
    }]
  },
  externals: [{
    'react': 'React'
  }]
}
