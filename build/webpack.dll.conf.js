const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: {
        vendor: ['vue/dist/vue.common.js', 'vue-router', 'axios', 'element-ui', 'element-china-area-data', 'vue-quill-editor'] // 这里是哪些module需要抽出来
    },
    output: {
        path: path.join(__dirname, '../static/js'),
        filename: '[name].dll.js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, '.', '[name]-manifest.json'),
            name: '[name]_library'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        })
    ]
};