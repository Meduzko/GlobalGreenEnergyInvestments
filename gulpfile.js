var gulp = require('gulp'), // Сообственно Gulp JS
    sass = require('gulp-sass'), // Сообственно Gulp JS
    csso = require('gulp-csso'), // Минификация CSS
    imagemin = require('gulp-imagemin'), // Минификация изображений
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов

    assetsRoot = 'app/assets/',
    publicRoot = 'public/',
    vendorRoot = 'vendor/assets/';

// Собираем JS
gulp.task('js', function () {
    gulp.src([assetsRoot + 'javascripts/*.js'])
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(gulp.dest(publicRoot + 'javascripts'));
});


// Собираем CSS
gulp.task('css', function () {
    gulp.src([
        assetsRoot + 'stylesheets/reset.scss',
        assetsRoot + 'stylesheets/*.scss'
    ])
        .pipe(sass())
        .pipe(csso())
        .pipe(concat('index.css'))
        .pipe(gulp.dest(publicRoot + 'stylesheets'));
});


// Копируем и минимизируем изображения
gulp.task('images', function () {
    gulp.src(assetsRoot + 'images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(publicRoot + 'images'));
});


gulp.task('add-vendors', function () {
    gulp.src(vendorRoot + 'javascript/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(publicRoot + 'javascripts'));

    gulp.src(vendorRoot + 'stylesheets/*.css')
        .pipe(csso())
        .pipe(gulp.dest(publicRoot + 'stylesheets'));
});


gulp.task('watch', ['images', 'js', 'css', 'add-vendors'], function () {
    gulp.watch(assetsRoot + 'javascripts/*.js', ['js']);
    gulp.watch(assetsRoot + 'images/*', ['images']);
    gulp.watch(assetsRoot + 'stylesheets/*.scss', ['css']);
});