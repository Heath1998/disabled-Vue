const path = require('path');

// 清除文件
const CleanWebpackPlugin = require("clean-webpack-plugin");

// 生成html文件
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 散列算法
const {HashedModuleIdsPlugin} = require('webpack');
var os = require('os')
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});

module.exports = {
  entry: {
    // 请求以下地址
    index: ['webpack-hot-middleware/client?noInfo=true&reload=true',path.resolve(__dirname, 'index.js')]
  },
  module: {
    rules: [{
      test: /(\.jsx|\.js)$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ["es2015"]
        }
      },
      exclude: /node_modules/,
      include: '/src/'
    }, {
      test: /(\.css|\.scss|\.sass)$/,
      use: ['css-loader', 'sass-loader', {
        loader: 'postcss-loader',
        options: {
          plugins: () => [require('autoprefixer')({
            'browsers': ['> 1%', 'last 2 versions']
          })]
        }

      }]
    }, {
      test: /\.(gif|jpg|png|ico)\??.*$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: '[name].[ext]',
          publicPath: '../../',
          outputPath: 'assets/css/'
        }
      }
    }, {
      test: /\.(svg|woff|otf|ttf|eot)\??.*$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: '[name].[ext]',
          publicPath: '../../',
          outputPath: 'assets/css/'
        }
      }
    }, {
      test: /\.html$/,
      use: {
        loader: 'html-loader',
        options: {
          minimize: true,  //打包图片成为base64形式
          removeComments: false, //移除注释
          collapseWhitespace: false  //一处空格
        }
      }
    }]
  },
  plugins: [
    new HappyPack({
      // loaders is the only required parameter:
      id: "js",
      loaders: ['babel-loader'],
      threadPool: happyThreadPool,
      verbose: true
    }),
    //清空dist
    new HashedModuleIdsPlugin(),
    new CleanWebpackPlugin(["dist"], {
      root: '',
      verbose: true,
      dry: false
    }),

    // 会生成<script src="index_bundle.js"></script>
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
      hash: false
    })

  ]
}