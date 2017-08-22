//webpack info and links
//  https://github.com/petehunt/webpack-howto


var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var merge = require('webpack-merge');
var pkg = require('./package.json');

var PATHS = {
  src: path.join(__dirname, 'src/'),
  dist: path.join(__dirname, 'dist/')
};

var common = {
    entry: {
        <%if(mappingFlavor == "lite"){%>
        app: PATHS.src + 'scripts/core-lite.js',
        <%}%>
        <%if(mappingFlavor == "full"){%>
        app: [PATHS.src + 'scripts/core-lite.js', PATHS.src + 'scripts/core-full.js'],
        <%}%>
        <%if(analyticsOption == "yes"){%>
        app: [PATHS.src + 'scripts/core-lite.js', PATHS.src + 'scripts/core-full.js'],
        <%}%>
        vendor: [
            PATHS.src + '/styles/main.css', 
            <%if(mappingAPI == "leaflet"){%>
            'leaflet/dist/leaflet.css',
            'leaflet', 
            'esri-leaflet',
            <%}%>
            'jquery', 
            'bootstrap',
            'bootstrap/dist/css/bootstrap.css'
        
        ]
    },
    output: {
        filename: 'bundle.min.js'<%if(mappingAPI == "esri"){%>,
        libraryTarget: "amd"
        <%}%>
    },
    <%if(mappingAPI == "esri"){%>
    // ESRI webpack version not working, see this link for info on making ESRI javascript api work with webpack:
    // http://tomwayson.com/2016/11/27/using-the-arcgis-api-for-javascript-in-applications-built-with-webpack/
    // https://gist.github.com/gund/6b22d5ffae42849252abc9a689eb656d
    externals: [
        function(context, request, callback) {
            if (/^dojo/.test(request) ||
            /^dojox/.test(request) ||
            /^dijit/.test(request) ||
            /^esri/.test(request)
            ) {
            return callback(null, "amd " + request);
            }
            callback();
        }
    ],
    <%}%>
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.png$/, loader: 'url-loader?limit=8192', query: { mimetype: 'image/png' } },
            { test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/, loader: 'url-loader' },
            { test: /\.js?$/, exclude: /node_modules/, loader: 'babel-loader' },
            { test: /\.html$/, loader: 'raw-loader' }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            '$': 'jquery',
            'jQuery': 'jquery'<%if(mappingAPI == "leaflet"){%>,
            'L.esri': 'esri-leaflet'
            <%}%>
        }),
        
        new webpack.DefinePlugin( {'VERSION': JSON.stringify(pkg.version) }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
    ]
};

var config;

// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(common, {
        output: {
            path: PATHS.dist + 'scripts/',
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin({compress: { warnings: false }}),
            new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
            new CopyWebpackPlugin([{ from: PATHS.src, to: PATHS.dist, ignore: ['core.js','appConfig.js', 'fonts/**/*', 'styles/**/*']} ]),
            new webpack.optimize.CommonsChunkPlugin({name:'vendor', filename:'vendor.bundle.min.js'}),
        ]
      }
    );
    break;
  default:
    config = merge( common, {
        output: {
            path: PATHS.src + 'scripts/',
        },
        plugins: [
            new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('development') }),
            new webpack.optimize.CommonsChunkPlugin({name:'vendor', filename:'vendor.bundle.min.js'}),
        ],
        devtool: 'eval-source-map',
        devServer: {
            // hot: true,
            // inline: true,
            open: true,
            contentBase: PATHS.src,
            // host: 'localhost',
            // port: 8080
        }
      }
    );
}

module.exports = config;