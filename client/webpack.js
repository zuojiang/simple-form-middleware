module.exports = {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    './client/index.es',
  ],
  output: {
    path: __dirname,
    filename: '../public/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.es$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              ['es2015', {
                loose: true,
              }],
              'stage-0',
            ],
            plugins: [
              ['transform-runtime', {
                polyfill: false,
              }],
            ]
          }
        }
      }, {
        test: /\.es$/,
        enforce: 'post',
        use: 'es3ify-loader',
      }
    ]
  },
  resolve: {
    extensions: ['.es', '.js', '.json']
  }
}
