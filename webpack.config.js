module.exports = {

    entry: "./js/main.js",

    output: {
        path: './public/scripts/',
        filename: "bundle.js"
    },

    externals: {
      'react': 'React',
      'underscore': '_'
      'jquery': '$'
    },

    module: {
        loaders: [
            { test: /\.jsx$/, loader: "jsx-loader?insertPragma=React.DOMharmony" }
        ]
    }
};