var gulp = require('gulp'), // Сообственно Gulp JS
    sass = require('gulp-sass'),
    csso = require('gulp-csso'), // Минификация CSS
    imagemin = require('gulp-imagemin'), // Минификация изображений
    svgo = require('gulp-svgo'),
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    svgSprite = require("gulp-svg-sprites"),
    browserSync = require('browser-sync'),
    assetsRoot = 'app/assets/',
    publicRoot = 'public/',
    vendorRoot = 'vendor/assets/';

// Собираем JS
gulp.task('js', function () {
    gulp.src([assetsRoot + 'javascripts/*.js'])
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(gulp.dest(publicRoot + 'javascripts'))
        .pipe(browserSync.reload({stream:true}));
});


// Собираем CSS
gulp.task('css', function () {
    gulp.src([
        assetsRoot + 'stylesheets/reset.scss',
        assetsRoot + 'stylesheets/general.scss',
        assetsRoot + 'stylesheets/ninja_slider.scss',
        assetsRoot + 'stylesheets/*.scss',
        assetsRoot + 'stylesheets/media_queries.scss'
    ])
        .pipe(sass())
        .pipe(csso())
        .pipe(concat('index.css'))
        .pipe(gulp.dest(publicRoot + 'stylesheets'))
        .pipe(browserSync.reload({stream:true}));
});


// Копируем и минимизируем изображения
gulp.task('images', function () {
    gulp.src([
        assetsRoot + 'images/**/*',
        assetsRoot + 'images/*',
        !assetsRoot + 'images/svg/*'
    ])
        .pipe(imagemin())
        .pipe(gulp.dest(publicRoot + 'images'))
        .pipe(browserSync.reload({stream:true}));
});


gulp.task('svg-optimization', function () {
    gulp.src(assetsRoot + 'images/*.svg')
        .pipe(svgo())
        .pipe(gulp.dest(publicRoot + 'images'));
});


gulp.task('svg-sprites', function () {
    return gulp.src(assetsRoot + 'images/svg/*.svg')
        .pipe(svgSprite({
            padding: 0
        }))
        .pipe(svgo())
        .pipe(gulp.dest(publicRoot + 'images'));
});


gulp.task('fonts', function () {
    gulp.src(assetsRoot + 'fonts/*')
        .pipe(gulp.dest(publicRoot + 'fonts'));
});


gulp.task('browser-sync', function() {
    browserSync({
        proxy: "localhost:3000",
        notify: false,
        debugInfo: false
        //host: 'localhost'
    });
});


gulp.task('add-vendors', function () {
    gulp.src(vendorRoot + 'javascripts/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(publicRoot + 'javascripts'));

    gulp.src(vendorRoot + 'stylesheets/*.css')
        .pipe(csso())
        .pipe(gulp.dest(publicRoot + 'stylesheets'));

    gulp.src(vendorRoot + 'images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(publicRoot + 'images'));
});


gulp.task('build', ['images', 'svg-optimization', 'svg-sprites', 'js', 'css', 'fonts']);


gulp.task('watch', ['images', 'js', 'css', 'browser-sync'], function () {
    gulp.watch(assetsRoot + 'javascripts/*.js', ['js']);
    gulp.watch(assetsRoot + 'images/*', ['images']);
    gulp.watch(assetsRoot + 'stylesheets/*.scss', ['css']);
    gulp.watch(assetsRoot + 'fonts/*', ['fonts']);
});
