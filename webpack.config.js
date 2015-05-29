
module.exports = {
    entry: './src/app/app.js',
    module: {
        loaders: [
            {test: /\.tpl\.html$/, loaders: ["html"]},
            {test: /\.css$/, loaders: ["style/useable", "css"]},
            {test: /\.less$/, loaders: ["style/useable", "css", "less"]},
        ]
    },
    output: {
        path: "build/",
        publicPath: "build/",
        filename: "bundle.js"
    }
};
