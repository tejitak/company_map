var gulp  = require('gulp');
var shell = require('gulp-shell');
var del = require('del');
var runSequence = require('run-sequence');
var bower = require('gulp-bower');
// var mainBowerFiles = require('main-bower-files');
var jshint = require('gulp-jshint');
var browserify = require('gulp-browserify');

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
    gulp.watch(['public/js/**/*.js', 'public/js/**/*.vue'], ['jshint', 'browserify']);
});

gulp.task('browserify', function() {
    // main page
    gulp.src('public/js/teji/company/map/main.js')
        .pipe(browserify({
            transform: gulp.env.production ? ["debowerify", "vueify", "uglifyify"] : ["debowerify", "vueify"],
            debug : !gulp.env.production
        }))
        .pipe(gulp.dest('public/dist'));
});

gulp.task('default', function(){
    runSequence('jshint', 'browserify', 'watch');
});

gulp.task('server', shell.task(['npm start']));

// use with --production
gulp.task('product', function(){
    runSequence('bower-install', 'jshint', 'browserify');
});

gulp.task('test', shell.task(['npm test']));