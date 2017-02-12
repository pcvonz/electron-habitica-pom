var gulp = require('gulp');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var exec = require('child_process').exec;
var electron = require('electron-connect').server.create();

//riot stuff
var riot = require('gulp-riot');
var concat = require('gulp-concat');
//var riotify = require('riotify');
//var source = require('vinyl-source-stream');
//var browserify = require('browserify') //bundles js


var path = {
    js: 'source/js/**/*.js',
    dest: 'app'
}

//TODO:
//Implement the optimze functions from Zell's tutorial
//https://css-tricks.com/gulp-for-beginners/

//riot tasks
gulp.task('riot', function() {
    gulp.src("source/tags/**/*.tag")
        .pipe(riot())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('app/static/js'));
});


gulp.task('open-iconic', function() {
    gulp.src('node_modules/open-iconic/svg/**/*.svg')
        .pipe(gulp.dest('app/static/images/open-iconic'))
});
gulp.task('moment', function() {
    gulp.src('node_modules/moment/moment.js')
        .pipe(gulp.dest('app/static/js'))
});
gulp.task('move-riot', function() {
    gulp.src('node_modules/riot/riot+compiler.min.js')
        .pipe(gulp.dest('app/static/js/'))
});

//Function to optimize images (not really utilized)
gulp.task('images', function() {
    return gulp.src('source/images/**/*.+(png|jpg|gif|svg)')
                                       .pipe(imagemin())
                                       .pipe(gulp.dest('app/static/images'))
});

gulp.task('electron', function() {
  electron.start();
});



gulp.task('js', function() {
    return gulp.src('source/js/**/*.js')
               .pipe(gulp.dest('app/static/js'))
});

gulp.task('sass', function(){
    return gulp.src('source/scss/style.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['node_modules/susy/sass', 'node_modules/normalize-scss/sass', 'node_modules/breakpoint-sass/stylesheets']
        }).on('error', sass.logError))
        .pipe(gulp.dest('app/static/css/'))
});


//watch the scss folder and rukn sass whenever
//a file changes
//We put browser sync in an array as the second argument
//that means that we want to run the browser sync task first
//and then watch for file changers
gulp.task('watch', ['js', 'moment', 'move-riot', 'riot', 'sass', 'open-iconic', 'images', 'electron'], function() {
    gulp.watch('source/scss/**/*.scss', ['sass', electron.reload]);
    gulp.watch('source/scripts/**/*.js', ['riot', electron.reload]);
    gulp.watch('source/js/**/*.js', ['js', electron.reload]);
    gulp.watch('source/tags/**/*.tag', ['riot', electron.reload]);
    gulp.watch('source/images/**/*.+(png|jpg|gif|svg)');
    gulp.watch('main.js', electron.restart);
    gulp.watch('app/index.html', electron.reload);
});
