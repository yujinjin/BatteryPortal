const path = require('path'),
	webpack = require('webpack'),
	NODE_ENV = process.env.NODE_ENV || "DEV", //环境类型
	NODE_RUN = process.env.NODE_RUN || "0", //是否是运行
	ROOT_PATH = path.resolve(__dirname) + "/",
	OUT_PATH = path.resolve(ROOT_PATH, 'build') + "/",
	SERVER_PATH = process.env.SERVER || "./build/",// 服务路径
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	glob = require('glob'),
	CleanWebpackPlugin = require('clean-webpack-plugin'),
	entry = {},
	chunks = [],
	port = "8088";
// 获取入口页列表
const getEntry = entries => {
    const srcDirName = entries + '/**/*.js'
    glob.sync(srcDirName).forEach(function (filepath) {
    	const name = filepath.slice(filepath.lastIndexOf("/") + 1, -3);
    	chunks.push(name);
        entry[name] = filepath;
    });
    return entry
}
getEntry('./src/assets/js/controller');
// 入口页面列表
const getPages = entries => {
	const pages = [];
	const srcDirName = entries + '/**/*.html';
	glob.sync(srcDirName).forEach(function (filepath) {
		const name = filepath.slice(filepath.lastIndexOf("/") + 1, -5);
		pages.push(new HtmlWebpackPlugin({
			filename: "../pages/" + name + ".html", //生成的html存放路径，相对于 path
			template: filepath, //html模板路径
			favicon: "./src/assets/imgs/site.ico",
			inject: true, //允许插件修改哪些内容，包括head与body
			chunks: ['commons', name],
			minify: { //压缩HTML文件
				removeComments: true, //移除HTML中的注释
				collapseWhitespace: false, //删除空白符与换行符
			}
		}));
	});
	return pages;
}
const config = {
	entry: entry,
	output: {
		path: NODE_RUN === "0" ? path.resolve(__dirname, './build') : "/",//"./build",//"./build",//path.resolve(__dirname, './build'), //path.resolve(__dirname, './build'), //
		//publicPath路径就是你发布之后的路径，比如你想发布到你站点的/util/vue/build 目录下, 那么设置publicPath: "/util/vue/build/",此字段配置如果不正确，发布后资源定位不对，比如：css里面的精灵图路径错误
		publicPath: NODE_RUN === "0" ? "/build/" : "/",//"build/",//SERVER_PATH, //process.env.CUSTOM ? "/git/WebApp/n-build/" : "/n-build/",
		filename: NODE_RUN === "0" ? "build.[chunkhash].[name].js" : "build.[name].js",
	},
	externals:[],
	module: {
		rules: [
		{
          	test: /\.tpl$/,
          	use: [{
          		loader: 'html-loader',
          		options: {
            		attrs: ['img:src', 'link:href']
          		}
           }]
		}, {
          	test: /\.ejs$/,
          	use: ['ejs-loader']
		}, {
            test: /\.js*$/,
            exclude: /^node_modules$/,
            use: ['babel-loader']
       	}, {
            test: /\.css$/,
            exclude: /^node_modules$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
            		{ loader: 'css-loader', options: { minimize: true } },
            		{ loader: 'postcss-loader', options: { sourceMap: true } }
          		],
                publicPath: "./"
            })
        }, {
            test: /\.less/,
            exclude: /^node_modules$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
	            	{ loader: 'css-loader', options: { minimize: true } },
	            	{ loader: 'postcss-loader', options: { sourceMap: true } },
	            	"less-loader"
	          	],
                publicPath: "./"
            })
        }, {
            test: /\.scss/,
            exclude: /^node_modules$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
            		{ loader: 'css-loader', options: { minimize: true } },
            		{ loader: 'postcss-loader', options: { sourceMap: true } },
            		'sass-loader'
          		],
                publicPath: "./"
            })
        }, {
            test: /\.(png|jpe?g|gif|svg|ico|swf|cur)(\?.*)?$/,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: 'imgs/[name].[hash:7].[ext]'
                }
            }]
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            use: [{
                loader: "url-loader",
                options: {
                    limit: 5000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }]
        }]
	},
	plugins:[
		new CleanWebpackPlugin(['build/*', 'pages/*'], {root: path.resolve(__dirname, './'), verbose: true, dry: false}),
		new ExtractTextPlugin({
			filename: NODE_RUN === "0" ? "style.[chunkhash].[name].css" : "style.[name].css",
			allChunks: true
		}), //必须要allChunks设置为true,不然webpack编译会报错
		new HtmlWebpackPlugin({
			filename: "../index.html", //生成的html存放路径，相对于 path
			template: './src/index.html', //html模板路径
			favicon: "./src/assets/imgs/site.ico",
			inject: true, //允许插件修改哪些内容，包括head与body
			chunks: ['commons', 'index'],
			minify: { //压缩HTML文件
				removeComments: true, //移除HTML中的注释
				collapseWhitespace: false, //删除空白符与换行符
			}
		}),
		...getPages("./src/pages/"),
		/*
		      使用CommonsChunkPlugin插件来处理重复代码
		      因为vendor.js和index.js都引用了spa-history, 如果不处理的话, 两个文件里都会有spa-history包的代码,
      		我们用CommonsChunkPlugin插件来使共同引用的文件只打包进vendor.js
      	*/
		new webpack.optimize.CommonsChunkPlugin({
			name: "commons",
			chunks: chunks, //提取哪些模块共有的部分
			filename: NODE_RUN === "0" ? "common.[chunkhash].js" : "common.js",
			minChunks: chunks.length
		}),
		//自动分析重用的模块并且打包成单独的文件
		new webpack.ProvidePlugin({
			//根据环境加载JS
			config: ROOT_PATH + "/src/assets/js/config/" + NODE_ENV,
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery",
		}),
		 //显示构建进度
        new webpack.ProgressPlugin(),
        new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: (NODE_RUN === "0" ? '"production"' : '""'), // 设置生产版本环境，目前只要是打包环境都算是生成环境
				TYPE: '"' + NODE_ENV + '"', //设置当前环境类型
				NODE_RUN: NODE_RUN //是否是运行状态
			}
		}),
		// 开启 Scope Hoisting
		new webpack.optimize.ModuleConcatenationPlugin(),
		function(){
	        this.plugin("done", function(stats) {
	            if (stats.compilation.errors && stats.compilation.errors.length){
	                console.log(stats.compilation.errors);
	                //process.exit(1);
	            }
	        });
	    }
	],
	resolve: {
        extensions: ['.js', '.less', '.scss', '.css'], //后缀名自动补全
        alias: {
        	js: path.resolve(__dirname, 'src/assets/js'),
        	components: path.resolve(__dirname, 'src/assets/js/components/')
        }
	}
}
//打包状态
if (NODE_RUN === "0") {
    config.devtool = false;
	config.performance = {
		hints: false
	};
	config.plugins = (config.plugins || []).concat([
//		new webpack.DefinePlugin({
//			'process.env': {
//				NODE_ENV: '"production"'
//			}
//		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
		        warnings: false,
		        screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true
		    },
		    output: {
		        comments: false
		    },
			sourceMap: false
		})
	]);
} else {
	config.devtool = '#cheap-module-eval-source-map';
	const ip = require('ip').address();
	config.performance = {
		hints: "warning"
	};
	//HotModuleReplacementPlugin 热加载插件
	config.plugins = (config.plugins || []).concat([
		new (require('friendly-errors-webpack-plugin')),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	]);
	// 热替换
	Object.keys(config.entry).forEach(function(name) {
	    config.entry[name] = [
	        `webpack-dev-server/client?http://${ip}:${port}/`,
	        "webpack/hot/dev-server"
	    ].concat(config.entry[name])
	});
	var opn = require('opn');
	var url = `http://${ip}:${port}/`;
	var webpackDevServer = require('webpack-dev-server');
	var compiler = webpack(config);
	var server = new webpackDevServer(compiler, {
		//hot: true,
    	quiet: true,
    	historyApiFallback: true, //配置为true, 当访问的文件不存在时, 返回根目录下的index.html文件
        noInfo: true,
        disableHostCheck: true, // 禁用服务检查
    	publicPath: "/" //TODO:必须是output中的publicPath保持一致
	});
	server.listen(port, ip);
	// 打包完毕后启动浏览器
	server.middleware.waitUntilValid(function() {
	    console.log(`> Listening at ${url}`);
	    opn(`${url}`);
	});
}
module.exports = config;
