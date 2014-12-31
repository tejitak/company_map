var gulp          = require('gulp');
var shell         = require('gulp-shell');
var del           = require('del');
var runSequence   = require('run-sequence');
var bower         = require('gulp-bower');
// var mainBowerFiles = require('main-bower-files');
var jshint        = require('gulp-jshint');
var browserify    = require('gulp-browserify');

var stylus        = require('gulp-stylus');
var pleeease      = require('gulp-pleeease');
var minifyCss     = require('gulp-minify-css');
var rename        = require('gulp-rename');
var webserver     = require('gulp-webserver');


// :stylus
gulp.task('stylus', function(){
  return gulp.src([
    './public/css/stylus/*.styl'
  ])
  .pipe(stylus())
  .pipe(pleeease())
  .pipe(minifyCss({keepSpecialComments: 0}))
  .pipe(rename({extname: '.min.css'}))
  .pipe(gulp.dest('./public/css/'));
});

// :Livereload for Static Build
gulp.task('webserver', function() {
  gulp.src('public')
  .pipe(webserver({
    livereload: true,
    port: 8088,
    //directoryListing: true,
    open: true
  }));
});


gulp.task('clean', del.bind(null, ['bower_components']));

gulp.task('bower-install', ['clean'], function() {
    return bower();
});

gulp.task('bower', ['bower-install'], function() {
    // return gulp.src(mainBowerFiles()).pipe(gulp.dest('public/js/lib/'))
});

gulp.task('jshint', function() {
    return gulp.src('public/js/teji/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', function() {
    gulp.watch(['public/js/teji/**/*.js', 'public/js/teji/**/*.vue'], ['jshint', 'browserify']);
    gulp.watch(['public/css/stylus/**/*.styl'],['stylus']);
});

gulp.task('browserify', function() {
    // main page
    gulp.src('public/js/teji/company/map/main.js')
        .pipe(browserify({
            transform: gulp.env.production ? ["debowerify", "vueify", "uglifyify"] : ["debowerify", "vueify"],
            debug : !gulp.env.production
        }))
        .pipe(gulp.dest('public/js'));
});

gulp.task('default', function(){
    runSequence('jshint', 'browserify', 'watch', 'stylus', 'webserver');
});

gulp.task('server', shell.task(['npm start']));

// use with --production
gulp.task('product', function(){
    runSequence('bower-install', 'jshint', 'browserify');
});

gulp.task('test', shell.task(['npm test']));