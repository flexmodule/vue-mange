'use strict'
// Template version: 1.2.3
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
    dev: {
        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        //开发环境跨域问题解决
        proxyTable: {
            '/fangwei/localhost': {
                target: 'https://192.168.137.202:9990',
                changeOrigin: true,
                pathRewrite: {
                    '^/fangwei/localhost': ''
                }
            },
            '/xuyiyi/localhost': {
                target: 'https://192.168.137.73:9999',
                changeOrigin: true,
                pathRewrite: {
                    '^/xuyiyi/localhost': ''
                }
            },
            '/xujiaen/localhost': {
                target: 'https://192.168.137.221:9999',
                changeOrigin: true,
                pathRewrite: {
                    '^/xujiaen/localhost': ''
                }
            },
            '/jiqijie/localhost': {
                target: 'https://192.168.137.182:9999',
                changeOrigin: true,
                pathRewrite: {
                    '^/jiqijie/localhost': ''
                }
            },
            '/wuqi/localhost': {
                target: 'https://192.168.137.76:9999',
                changeOrigin: true,
                pathRewrite: {
                    '^/wuqi/localhost': ''
                }
            },
            '/weibin/localhost': {
                target: 'https://192.168.137.135:9999',
                changeOrigin: true,
                pathRewrite: {
                    '^/weibin/localhost': ''
                }
            },
            '/test/localhost': {
                target: 'https://ops.testapi2.healthydoc.com.cn',
                changeOrigin: true,
                pathRewrite: {
                    '^/test/localhost': ''
                }
            },
            '/zhangjin/localhost': {
                target: 'https://192.168.137.76:9999',
                changeOrigin: true,
                pathRewrite: {
                    '^/zhangjin/localhost': ''
                }
            },
            '/liquan/localhost': {
                target: 'https://192.168.137.76:9999',
                changeOrigin: true,
                pathRewrite: {
                    '^/liquan/localhost': ''
                }
            },
            '/chenhongqian/localhost': {
                target: 'https://192.168.137.171:9999',
                changeOrigin: true,
                pathRewrite: {
                    '^/cehnhongqian/localhost': ''
                }
            },
            '/file/localhost': {
                target: 'https://file.testapi2.healthydoc.com.cn',
                changeOrigin: true,
                pathRewrite: {
                    '^/file/localhost': ''
                }
            },
            '/showfile/localhost': {
                target: 'https://file.testapi2.healthydoc.com.cn',
                changeOrigin: true,
                pathRewrite: {
                    '^/showfile/localhost': ''
                }
            },
        },

        // Various Dev Server settings
        host: '0.0.0.0', // can be overwritten by process.env.HOST
        port: 8080, // can be overwritten by process.env.HOST, if port is in use, a free one will be determined
        autoOpenBrowser: true,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

        // Use Eslint Loader?
        // If true, your code will be linted during bundling and
        // linting errors and warnings will be shown in the console.
        useEslint: true,
        // If true, eslint errors and warnings will also be shown in the error overlay
        // in the browser.
        showEslintErrorsInOverlay: false,

        /**
         * Source Maps
         */

        // https://webpack.js.org/configuration/devtool/#development
        devtool: 'inline-source-map',

        // If you have problems debugging vue-files in devtools,
        // set this to false - it *may* help
        // https://vue-loader.vuejs.org/en/options.html#cachebusting
        cacheBusting: true,

        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false,
    },

    build: {
        // Template for index.html
        index: path.resolve(__dirname, '../dist/index.html'),

        // Paths
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',

        /**
         * Source Maps
         */

        productionSourceMap: true,
        // https://webpack.js.org/configuration/devtool/#production
        devtool: '#source-map',

        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],

        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    }
}