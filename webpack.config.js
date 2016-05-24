/* eslint-disable func-names */
'use strict';
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const env = require('yargs').argv.mode;
const target = require('yargs').argv.target;

const UglifyPlugin = webpack.optimize.UglifyJsPlugin;
const CommonsChunkPlugin =  webpack.optimize.CommonsChunkPlugin
const DedupePlugin = webpack.optimize.DedupePlugin;
const OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin;

const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackMd5Hash = require('webpack-md5-hash');
const WebpackOnBuildPlugin = require('on-build-webpack');

const nodeModulesDir = path.resolve(__dirname, '../node_modules');


const fileName = 'app';
const appName = 'conceptdictionary'

const plugins = [];
const nodeModules = {};

let outputFile;
let vendorOutputFile;
let outputPath;

var configJson;
let appEntryPoint;
let localOwaFolder;

let devtool;

try{
	configJson = require('./config.json');
	appEntryPoint = configJson.APP_ENTRY_POINT;
	localOwaFolder = configJson.LOCAL_OWA_FOLDER;
} catch(err){
	appEntryPoint = "http://localhost:8080//openmrs//owa//conceptdictionary//index.html";
	localOwaFolder = `${__dirname}/build/dist/`;
}



/** Don't bundle dependencies for node module */
if (target === 'web') {
  outputFile = `${fileName}.bundle`;
} else if (target === 'node') {
  outputFile = fileName;

  fs.readdirSync('node_modules')
    .filter(x =>
      ['.bin'].indexOf(x) === -1
    )
    .forEach(mod => {
      nodeModules[mod] = `commonjs ${mod}`;
    });
}

/** Minify for production */
if (env === 'production') {
  plugins.push(new UglifyPlugin({
    output: {
      comments: false,
    },
    minimize: true,
    sourceMap: false,
    compress: {
        warnings: false,
        unused: false
    }
  }));
  plugins.push(new DedupePlugin());
  outputFile = `${outputFile}.min.[chunkhash].js`;
  vendorOutputFile = "vendor.bundle.[chunkhash].js";
  outputPath = `${__dirname}/build/dist/`;
  devtool = 'source-map';
  
  plugins.push(new WebpackOnBuildPlugin(function(stats){
    //create zip file
    var archiver = require('archiver');
    var pjson = require('./package.json');
    var output = fs.createWriteStream('build/' + appName + "-" + pjson.version +'.zip');
    var archive = archiver('zip')

    output.on('close', function () {
	  console.log('Distributable has been zipped! size: '+archive.pointer());
    });

    archive.on('error', function(err){
	  throw err;
    });

    archive.pipe(output);
    archive.bulk([{ expand: true, cwd: 'build/dist/', src: ['**']}]);
    archive.finalize();
  }));
  
} else if (env === 'dev') {
  outputFile = `${outputFile}.js`;
  vendorOutputFile = "vendor.bundle.js";
  outputPath = `${localOwaFolder}${appName}`;
  devtool = 'source-map';
}

plugins.push(new BrowserSyncPlugin({
    host: 'localhost',
    port: 3000,
    proxy: {
    	target : appEntryPoint
    }
}));

plugins.push(new CommonsChunkPlugin("vendor", vendorOutputFile));

plugins.push(new HtmlWebpackPlugin({
    template: './app/index.html',
    inject: 'head'
}));

plugins.push(new CopyWebpackPlugin([{
    from: './app/manifest.webapp'
}]));

plugins.push(new CopyWebpackPlugin([{
    from: './app/img/omrs-button.png',
    to: 'img/omrs-button.png'
}]));

plugins.push(new OccurenceOrderPlugin());

plugins.push(new WebpackMd5Hash());

var config = {
  entry: {
	  app : `${__dirname}/app/components/conceptDictionaryApp.module.js`,
	  vendor : [
		            'angular',
		            'angular-translate',
		            'angular-route',
		            'openmrs-contrib-uicommons' 
	            ]
  },
  devtool: devtool,
  target,
  output: {
    path: outputPath,
    filename: outputFile,
  },
  module: {
    loaders: [{
	    test: /\.jsx?$/,
	    loader: 'babel-loader',
	    exclude: /node_modules/,
	    query: {
	        presets: ['es2015'],
	        cacheDirectory : true
        }
    }, {
	    test: /\.css$/,
	    loader: 'css'
	}, {
	    test: /\.(png|jpg|jpeg|gif|svg)$/,
	    loader: 'url'
	},{
		test: /\.json$/,
		loader: 'json'
		
	},{
	    test: /\.html$/,
	    loader: 'raw'
	}, {
        test: /\.scss$/,
        loader: "style!css!sass?outputStyle=expanded&includePaths[]=" 
        		+ path.resolve(__dirname, "./node_modules/compass-mixins/lib")
      },
        {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url'},
        {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url'},
        {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url'},
        {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url'},
        {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'url'},],
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js'],
  },
  plugins,
  externals: nodeModules,
};

module.exports = config;
