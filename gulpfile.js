var gulp = require('gulp'), // Сообственно Gulp JS
    sass = require('gulp-sass'),
    csso = require('gulp-csso'), // Минификация CSS
    imagemin = require('gulp-imagemin'), // Минификация изображений
    svgo = require('gulp-svgo'),
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    svgSprite = require("gulp-svg-sprites"),
    svgToPng = require("gulp-svg2png"),
    spritesmith = require('gulp.spritesmith'),
    browserSync = require('browser-sync'),
    gulpFilter = require('gulp-filter'),
    runSequence = require('run-sequence'),
    del = require('del'),
    mainBowerFiles = require('main-bower-files'),
    assetsRoot = 'app/assets/',
    publicRoot = 'public/';


// Собираем JS
gulp.task('bower-to-public', function () {
    return gulp.src(mainBowerFiles())
        .pipe(uglify())
        .pipe(gulp.dest(publicRoot + 'javascripts/vendors'));
});

gulp.task('js', ['bower-to-public'], function () {
    return gulp.src([
        publicRoot + 'javascripts/vendors/require.js',
        assetsRoot + 'javascripts/requireConfig.js',
        assetsRoot + 'javascripts/compSupport.js',
        assetsRoot + 'javascripts/*.js',
        assetsRoot + 'javascripts/index.js'
    ])
        .pipe(gulpFilter(['*', '!components']))
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(gulp.dest(publicRoot + 'javascripts'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('js-components', function () {
    return gulp.src([
        assetsRoot + 'javascripts/components/*.js'
    ])
        .pipe(uglify())
        .pipe(gulp.dest(publicRoot + 'javascripts/components'))
        .pipe(browserSync.reload({stream: true}));
});

// Собираем CSS
gulp.task('css', function () {

    gulp.src([
        assetsRoot + 'stylesheets/reset.scss',
        assetsRoot + 'stylesheets/general.scss',
        assetsRoot + 'stylesheets/swiper.scss',
        assetsRoot + 'stylesheets/!(media_queries)*.scss',
        assetsRoot + 'stylesheets/media_queries.scss'
    ])
        .pipe(gulpFilter(['*', '!active_admin.css.scss']))
        .pipe(sass())
        .pipe(csso())
        .pipe(concat('index.css'))
        .pipe(gulp.dest(publicRoot + 'stylesheets'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('fonts', function () {

    gulp.src(assetsRoot + 'fonts/*')
        .pipe(gulp.dest(publicRoot + 'fonts'));
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
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('static', function () {
    gulp.src(assetsRoot + 'static/*')
        .pipe(gulp.dest(publicRoot));
});


gulp.task('svg-optimization', function () {
    gulp.src(assetsRoot + 'images/svg/*.svg')
        .pipe(svgo())
        .pipe(gulp.dest(publicRoot + 'images'));
});


/*gulp.task('svg-sprites', function () {
    return gulp.src(assetsRoot + 'images/svg*//*.svg')
        .pipe(svgSprite())
        .pipe(svgo())
        .pipe(gulp.dest(publicRoot + 'images'));
});*/


gulp.task('svg-to-png', function () {
    return gulp.src(assetsRoot + 'images/svg/*.svg')
        .pipe(svgToPng())
        .pipe(gulp.dest(publicRoot + 'images/generated'));
});


gulp.task('browser-sync', function () {
    browserSync({
        proxy: "localhost:3000",
        notify: false,
        debugInfo: false
    });
});


gulp.task('clean', function () {
    return del(publicRoot + 'public/**');
});


gulp.task('build', function(callback) {
    runSequence('clean',
        ['images', 'svg-optimization', 'js', 'js-components', 'css', 'fonts', 'static'],
        callback);
});


gulp.task('watch', ['images', 'js', 'js-components', 'css', 'browser-sync'], function () {
    gulp.watch(assetsRoot + 'javascripts/*.js', ['js']);
    gulp.watch(assetsRoot + 'javascripts/components/*.js', ['js-components']);
    gulp.watch(assetsRoot + 'images/*', ['images']);
    gulp.watch(assetsRoot + 'stylesheets/*.scss', ['css']);
    gulp.watch(assetsRoot + 'fonts/*', ['fonts']);
});
