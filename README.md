# npmとwebpackで作るRiot.js、学習のためのいい感じのフロントエンド開発環境 2016年6月の場合。

[Riot.js — A React-like user interface micro-library &middot; Riot.js](http://riotjs.com/ja/)

ReactやAngularJSは「でかすぎる」という問題がずっとあって、それは必要だからそうなのかもしれないけど使うプロダクトがかなり限定されるような気がする。  
もう少し小さなプロジェクトもしくは、はじまりは小さくはじめたいという場合はRiot.jsや[vue.js](https://jp.vuejs.org/)あたりが最適なんじゃないかと言われている。

ということでRiot.jsの学習をはじめるための環境をnpm + webpackで作ってみた。
ついでなのでBabelでES2015の機能を取り入れた書き方ができるようにもしてます。  

[Babel · The compiler for writing next generation JavaScript](https://babeljs.io/)

サーバーとのHTTP通信などが必要になったら[SuperAgent](https://github.com/visionmedia/superagent)や[axios](https://github.com/mzabriskie/axios)あたりを使うといいんじゃないかと思う。  
もう少しRiot.jsの勉強が進んだらそちらの環境も作ってみようと思う。


## 必要なものあるかどうか確認

```
node -v
```
まずはお決まりのNode.js入ってるか確認。

```
npm -v
```
npm（Node.jsのパッケージマネージャー）も入ってるか確認。

```
webpack -v
```
webpackも入っているか確認。  
もし入ってなかったら

```
npm install -g webpack
```
-gオプションはGlobalオプションのこと。

## ファイル・フォルダ構成

```
git clone https://github.com/shigekitakeguchi/npm-webpack-riotjs.git
```
[https://github.com/shigekitakeguchi/npm-webpack-riotjs](https://github.com/shigekitakeguchi/npm-webpack-riotjs)

GitHubから落として使ってください。  
カスタマイズなりなんなりして。

```
cd npm-webpack-riotjs
```
落としたフォルダ内に移動する。

```
├── README.md
├── app
│   ├── index.html
│   └── scripts
├── bs-config.json
├── package.json
├── src
│   └── scripts
│       ├── app.tag
│       ├── index.js
│       └── name.tag
└── webpack.config.js
```
ファイル・フォルダ構成はこんな感じ。  
README.mdは不要。今回は、わかりよいようにサンプルを入れてます。  
「.tag」という珍しい拡張子のファイルがRiot.jsの特徴でもあります。説明はのちほど。

```
npm install
```

これで必要なパッケージがインストールされるはず。  

## package.json

```json
{
  "name": "npm-webpack-riotjs",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "devDependencies": {
    "babel": "^6.5.2",
    "babel-core": "^6.10.4",
    "babel-loader": "^6.2.4",
    "babel-preset-es2015-riot": "^1.1.0",
    "concurrently": "^2.1.0",
    "lite-server": "^2.2.0",
    "riotjs-loader": "^3.0.0",
    "webpack": "^1.13.0"
  },
  "scripts": {
    "webpack": "webpack -w",
    "lite": "lite-server",
    "start": "concurrently \"npm run lite\" \"npm run webpack\""
  },
  "keywords": [],
  "author": "shigeki.takeguchi",
  "license": "MIT",
  "dependencies": {
    "riot": "^2.4.1"
  }
}
```
中身はこんな感じ。

### パッケージの説明

落としてきたpackage.jsonからインストールすればいいんですがそれぞれのパッケージの説明を。

```
npm install --save-dev babel-core
```
[https://github.com/babel/babel/tree/master/packages/babel-core](https://github.com/babel/babel/tree/master/packages/babel-core)

言わずもがな、Babelのコンパイラのコア。

```
npm install --save-dev babel-loader
```
[https://github.com/babel/babel-loader](https://github.com/babel/babel-loader)

webpackでES2015構文で書いたファイルをトランスパイルするのに必要。

```
npm install --save-dev babel-preset-es2015-riot
```
[https://github.com/riot/babel-preset-es2015-riot](https://github.com/riot/babel-preset-es2015-riot)

Riot.js用のBabelでES2015を扱うためのプラグイン。

```
npm install -save-dev riotjs-loader
```
[https://github.com/esnunes/riotjs-loader](https://github.com/esnunes/riotjs-loader)

webpackでRiot.jsをあつかえるようにするためのローダーです。

```
npm install -save riot
```
[https://github.com/riot/riot](https://github.com/riot/riot)

以前はRiotjsだったらしいですがRiotになったらしいです。

```
npm install --save-dev concurrently
```
[https://github.com/kimmobrunfeldt/concurrently](https://github.com/kimmobrunfeldt/concurrently)

concurrentlyは複数のコマンド実行できるようにするため。具体的に何をしているかは後ほど説明。

```
npm install --save-dev lite-server
```
[https://github.com/johnpapa/lite-server](https://github.com/johnpapa/lite-server)

webpackにもwebpack dev serverというのがあるみたいだけどlite-serverのがシンプルで良さそうなので使ってみた。  
ただし設定ファイルは必要でした。

```
npm install --save-dev webpack
```
[https://github.com/webpack/webpack](https://github.com/webpack/webpack)

webpack。もうすでに何をするツールなのか説明しがたいくらい機能がある。  
静的なファイル（JavaScript系、CSS系、画像ファイル）の依存関係を解決するためのビルドツールってことなんだけど、ここでははJavaScriptだけを扱うようにしている。

## package.jsonの中のscriptsで何をしているか

```json
"scripts": {
  "webpack": "webpack -w",
  "lite": "lite-server",
  "start": "concurrently \"npm run lite\" \"npm run webpack\""
},
```

```
npm start
```

このコマンドでlite-serverを立ち上げwebpackでwatchを行いJavaScriptの変更を監視するようにしている。

```json
"start": "concurrently \"npm run lite\" \"npm run webpack\""
```
scriptsの中にあるstartがこれにあたる。

```
npm run lite
```
```
npm run webpack
```

これらのコマンドはそれぞれ独立したコマンドですが、最初にちょっと触れたがconcurrentlyにダブルクオーテーションでくくってスペースで区切って引数で渡せば並行して実行することになる。便利。

```json
"webpack": "webpack -w",
```
これはwebpackのwatch（監視）を走らせている。こちらも後ほど触れるがwebpack.config.jsonで記述されたことをもとに監視している。

```json
"lite": "lite-server",
```
lite-serverを立ち上げている。bs-config.jsonに設定ないようを記述している（こちらも後ほど触れる）。

## webpack.config.json
```javascript
var webpack = require("webpack");

module.exports = {
  entry: './src/scripts/index.js',
  output: {
    path: __dirname + '/app/scripts',
    filename: 'bundle.js',
		publicPath: '/app/',
  },
  module: {
    preLoaders: [
      {
        test: /\.tag$/,
        exclude: /node_modules/,
        loader: 'riotjs-loader',
        query: {
          type: 'babel'
        }
      }
    ],
    loaders: [
      {
        test: /\.js$|\.tag$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
      extensions: ['', '.js', '.tag']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.ProvidePlugin({
      riot: 'riot'
    })
  ]
}
```
webpackの設定です。entryにもとファイル（複数ある場合は配列で持たせる）。outputに出力される設定を記述。今回はbundle.jsっていう一般的によく使われているらしい名称のまま。  
moduleのなかのloadersでRiot.js（拡張子は.jsと.tagを扱えるようにしてます）とES2015をコンパイル、トランスパイルするように設定している。

ほぼriotjs-loaderのREADMEに書かれている感じ（若干の変更）です。
[https://github.com/esnunes/riotjs-loader](https://github.com/esnunes/riotjs-loader)

そして素のままのファイルだともうファイルがでかくてあれなんでUglifyJsPluginで圧縮・最適化。

## bs-config.json

```json
{
  "injectChanges": "true",
  "files": ["./app/**/*.{html,htm,css,js}"],
  "watchOptions": { "ignored": "node_modules" },
  "server": { "baseDir": "./app" }
}
```
lite-serverの設定はドキュメントルートをappの直下にしたかったのと監視対象のファイル（html、css、js）が変更されたらリロードしてinjectChangesというBrowsersyncを動すため。

## サンプルのソースコード

### /app/index.html
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>App</title>
</head>
<body>
  <app></app>
  <script src="scripts/bundle.js"></script>
</body>
</html>
``` 

### /src/scripts/index.js

```javascript
require('./app.tag');

riot.mount('*');
```

### /src/scripts/app.tag

```html
require('./name.tag');

<app>
  <name first="Hello" last="World"></name>
  <name first="Ola" last="Mundo"></name>
</app>
```

### /src/scripts/name.tag

```html
<name>
  <h1>{ opts.last }, { opts.first }</h1>
</name>
```

これらはここに書かれている参考のままです。  
[https://github.com/esnunes/riotjs-loader](https://github.com/esnunes/riotjs-loader)


---

個人的にはReactを勉強するために環境をさくっと用意したかったために作った。  
なのでReactもまだよくわかってない。またwebpackをはじめて数日とかという状態なので間違えや指摘をいただけると助かります。
