/*
* @Author: baby
* @Date:   2016-03-02 08:41:53
 * @Last Modified by: fengyun2
 * @Last Modified time: 2016-11-10 19:16:51
*/

'use strict'

var gulp = require('gulp') // 引入gulp

// 引入组件
// var jshint = require('gulp-jshint') // 检查js
var sass = require('gulp-sass') // 编译sass
// var concat = require('gulp-concat') // 合并
// var uglify = require('gulp-uglify') // 压缩js
// var imagemin = require('gulp-imagemin') // 压缩图片
// var sourcemaps = require('gulp-sourcemaps')
// var rename = require('gulp-rename') // 重命名
// var del = require('del') // 删除
var htmlmin = require('gulp-htmlmin') // 压缩html
var plumber	 = require('gulp-plumber') // 中端执行
// var minifyCss = require('gulp-minify-css') // 压缩css为一行
// var rev = require('gulp-rev')	// 对文件名加MD5后缀
// var revCollector = require('gulp-rev-collector') // 路径替换
var gulpSequence = require('gulp-sequence')	// 顺序执行
// var px2rem = require('gulp-px2rem') // px -> rem
var autoprefixer = require('gulp-autoprefixer') // 浏览器前缀
let changed = require('gulp-changed')
let debug = require('gulp-debug')

var paths = {
  js: ['src/js/*.js'],
  sass_file: ['src/scss/*.scss'],
  sass_dir: 'src/scss',

  css_ori_file: ['src/css/**/*.css'],
  css_ori_dir: 'src/css',
  css_min_file: ['src/css/**/*.css'],
  css_min_dir: 'src/css',

  images: ['src/img/**/*'],
  html: ['src/html/**/*']
}

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
  // You can use multiple globbing patterns as you would with `gulp.src`
  return del(['dist'])
})

// 检查js脚本的任务
gulp.task('lint',function() {
	return gulp.src(paths.js)
	// .pipe(plumber())
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
})

// 编译sass
gulp.task('sass', function() {
	var options = {
		outputStyle:"compact"
	}
	return gulp.src(paths.sass_file)
  .pipe(debug({title: '编译: '}))
	.pipe(plumber())
  // .pipe(changed(paths.css_ori_dir))
  .pipe(sass(options))
	.pipe(gulp.dest(paths.css_ori_dir))
})

// 添加浏览器前缀
gulp.task('autoprefixer',function() {
  /**
   * browsers 参数:
   * last 2 versions: 主流浏览器的最新两个版本
   * last 1 Chrome versions: 谷歌浏览器的最新版本
   * last 2 Explorer versions: IE的最新两个版本
   * last 3 Safari versions: 苹果浏览器最新三个版本
   * Firefox >= 20: 火狐浏览器的版本大于或等于20
   * iOS 7: IOS7版本
   * Firefox ESR: 最新ESR版本的火狐
   * > 5%: 全球统计有超过5%的使用率
   *
   *
   */
  var options = {
    browsers: ['last 2 versions', 'Android >= 4.0'],
    cascade: true, //是否美化属性值 默认：true 像这样：
    //-webkit-transform: rotate(45deg);
    //        transform: rotate(45deg);
    remove:true //是否去掉不必要的前缀 默认：true
  }
  return gulp.src(paths.css_ori_file)
  .pipe(autoprefixer(options))
  .pipe(gulp.dest(paths.css_ori_dir))
})

// 将px -> rem
gulp.task('px2rem', function() {
  var px2remOptions = {
    rootValue: 75,
    unitPrecision: 5,
    propertyBlackList: ['font-size'],
    propertyWhiteList: [],
    replace: true,
    mediaQuery: false,
    minPx: 1
  }

  // var postCssOptions = {
  //     map: true
  // };
  return gulp.src(paths.css_ori_file)
  .pipe(px2rem(px2remOptions))
  .pipe(gulp.dest(paths.css_ori_dir))
})

// 合并压缩css
gulp.task('css', function() {
	return gulp.src(paths.css_ori_file)
  // .pipe(minifyCss())        // 压缩处理成一行
	.pipe(concat('all.min.css'))	// 压缩后的css文件名
	// .pipe(rev())					// 文件名加MD5后缀
	.pipe(gulp.dest(paths.css_min_dir))	// 输出文件本地
	// .pipe(rev.manifest())			// 生成一个rev-manifest.json
	.pipe(gulp.dest('dist/rev/css'))	// 将 rev-manifest.json 保存到 dist/rev 目录内
})


// 替换md5文件名
gulp.task('rev', function() {
  var options = {
    replaceReved: true,
    dirReplacements: {
        'css': 'dist/css',
        'js': 'dist/js',
    }
  }
	return gulp.src(['dist/rev/**/*.json','dist/old_html/**/index.html']) // 读取 rev-manifest.json 文件以及需要进行css名替换的文件
	// .pipe(revCollector())								// 替换后的文件输出的目录
  .pipe(gulp.dest('dist/html/'))
})




// 合并，压缩js文件
gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.js)
  // .pipe(plumber())
  // .pipe(sourcemaps.init())
      // .pipe(uglify())
      // .pipe(rename('all.min.js'))
      .pipe(concat('all.min.js'))	// 压缩后的js文件名
      // .pipe(rev())					// 文件名加MD5后缀
      // .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/js'))
      // .pipe(rev.manifest())     // 生成一个rev-manifest.json
      // .pipe(gulp.dest('dist/rev/js')) // 将 rev-manifest.json 保存到 dist/rev 目录内
  })

// 压缩图片
gulp.task('images', function() {
	return gulp.src(paths.images)
	// .pipe(plumber())
    // Pass in options to the task
    // .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('dist/img'))
})

// 压缩html
gulp.task('html', function () {
	var options = {
            removeComments: true,//清除HTML注释
            // collapseWhitespace: true,//压缩HTML
            collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
            minifyJS: true,//压缩页面JS
            minifyCSS: true//压缩页面CSS
        }
        return gulp.src(paths.html)
        // .pipe(plumber())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/old_html'))
    })

// 当文件发生变化后会自动执行任务
gulp.task('watch', function() {
	// gulp.watch(paths.js, ['scripts']);
  gulp.watch(paths.sass_file, ['sass'])
	// gulp.watch(paths.images, ['images']);
})

// 定义默认任务,执行gulp会自动执行的任务
// gulp.task('default',
// 	[
// 	// 'watch',
// 	'lint',
// 	'scripts',
// 	'sass',
// 	'css',
// 	'images',
// 	'html',
// 	'rev'
// 	]);


// gulp.task('default',gulpSequence('watch','lint','clean',['sass','images','autoprefixer'],'css','html'))

gulp.task('default', gulpSequence('sass', 'autoprefixer', 'watch'))



// gulp.task('default',gulpSequence('watch','lint','clean',['sass','images','autoprefixer'],'px2rem','css','html'));
// gulp.task('default',gulpSequence('watch','lint','clean',['scripts','sass','images','html'],'css','rev'));


