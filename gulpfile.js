var fs=require('fs')
var
  gulp=require('gulp'),
  util=require('gulp-util'),
  plumber=require('gulp-plumber'),
  webpack=require('gulp-webpack'),
  rename=require('gulp-rename'),
  browserSync=require('browser-sync'),
  jade=require('gulp-jade'),
  replace=require('gulp-html-replace')
  uglify=require('gulp-uglify'),
  plumber=require('gulp-plumber')

var error = function(e){
  util.beep()
  util.log(e.toString())
}

var jadeTasks=[],jsxTasks=[]

var paths={
  dev:{
    jade:'src/jade',
    jsx:'src/jsx'
  },
  build:{
    html:'dist',
    js:'dist/js'
  }
}
//调试工具
gulp.task('reload-browser',function(){
  browserSync.reload()
})
gulp.task('browser-sync',function(){
  browserSync({
    server: {
      baseDir: "./dist"
    }
  })
  gulp.watch('dist/**',['reload-browser'])
})

//遍历所有模板页
var pages=fs.readdirSync(paths.dev.jade).map(function(item){
  return item.substring(0,item.indexOf('.jade'))
})
for(var i=0;i<pages.length;i++) {
  if(pages[i] == ''|| typeof(pages[i]) == 'undefined') {
    pages.splice(i,1);
    i= i-1;
  }
}
//为每个模板页生成相应的任务
for(var i in pages){
  var pageName=pages[i],jadeTaskName='jade-'+pageName,jsxTaskName='jsx-'+pageName
  //生成jade任务
  !function(pageName,jadeTaskName,jsxTaskName){
    gulp.task(jadeTaskName,function(){
      gulp.src(paths.dev.jade+'/'+pageName+'.jade')
        .pipe(plumber({"errorHandler":error}))
        .pipe(jade())
        .pipe(replace({
          'js':'js/'+pageName+'.min.js'
        }))
        .pipe(gulp.dest(paths.build.html))
      gulp.watch([paths.dev.jade+'/'+pageName+'.jade',paths.dev.jade+'/includes/**'],[jadeTaskName])
    })
    //生成jsx任务
    gulp.task(jsxTaskName,function(){
      gulp.src(paths.dev.jsx+'/'+pageName+'/**')
        .pipe(plumber({"errorHandler":error}))
        .pipe(webpack({
          module: {
            loaders: [
              { test: /\.jsx$|.js$/,loader: 'babel-loader' }
            ]
          },
          stage: 0
        }))
        .pipe(uglify())
        .pipe(rename(pageName+'.min.js'))
        .pipe(gulp.dest(paths.build.js))
      gulp.watch([paths.dev.jsx+'/'+pageName+'/main.jsx','src/jsx/components/','src/jsx/util'],[jsxTaskName])
    })
    //推送至任务列表
    jadeTasks.push(jadeTaskName)
    jsxTasks.push(jsxTaskName)
  }(pageName,jadeTaskName,jsxTaskName)
}
//生产环境打包
gulp.task('build',function(){
  //todo:publish
})
//入口
gulp.task('default',['browser-sync'].concat(jadeTasks).concat(jsxTasks))