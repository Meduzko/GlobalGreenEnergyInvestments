var gulp = require('gulp'), // Сообственно Gulp JS
    sass = require('gulp-sass'),
    csso = require('gulp-csso'), // Минификация CSS
    imagemin = require('gulp-imagemin'), // Минификация изображений
    pngquant = require('imagemin-pngquant'),
    uglify = require('gulp-uglify'), // Минификация JS
    concat = require('gulp-concat'), // Склейка файлов
    svgSprite = require("gulp-svg-sprites"),
    svgToPng = require("gulp-svg2png"),
    spritesmith = require('gulp.spritesmith'),
    browserSync = require('browser-sync'),
    gulpFilter = require('gulp-filter'),
    runSequence = require('run-sequence'),
    del = require('del'),
    base64 = require('gulp-base64'),
    mainBowerFiles = require('main-bower-files'),
    assetsRoot = 'app/assets/',
    publicRoot = 'public/';


// Build JS
gulp.task('bower-to-public', function () {
    return gulp.src(mainBowerFiles())
        .pipe(gulpFilter(['*', '!*.css', '!*.scss', '!*.less']))
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
        .pipe(gulpFilter(['*', '!components', '!application.js']))
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


// Build CSS
gulp.task('css', function () {

    gulp.src([
        assetsRoot + 'stylesheets/general/*.scss',
        assetsRoot + 'stylesheets/vendor/*.scss',
        assetsRoot + 'stylesheets/partials/*.scss',
        assetsRoot + 'stylesheets/inner_pages/*.scss',
        assetsRoot + 'stylesheets/*.scss'
    ])
        .pipe(gulpFilter(['*', '!active_admin.css.scss']))
        .pipe(sass())
        .pipe(base64({
            baseDir: publicRoot,
            extensions: ['png'],
            maxImageSize: 8 * 1024
        }))
        .pipe(csso())
        .pipe(concat('index.css'))
        .pipe(gulp.dest(publicRoot + 'stylesheets'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('fonts', function () {

    gulp.src(assetsRoot + 'fonts/*')
        .pipe(gulp.dest(publicRoot + 'fonts'));
});


// Copy and minimize images
gulp.task('images', ['svg-optimization'], function () {
    gulp.src([
        assetsRoot + 'images/**/*',
        assetsRoot + 'images/**',
        assetsRoot + 'images/*'
    ])
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest(publicRoot + 'images'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('video', function () {
    gulp.src(assetsRoot + 'video/*')
        .pipe(gulp.dest(publicRoot + 'video'));
});


gulp.task('static', function () {
    gulp.src(assetsRoot + 'static/*')
        .pipe(gulp.dest(publicRoot));
});


gulp.task('svg-optimization', function () {
    gulp.src(assetsRoot + 'images/svg/*.svg')
        .pipe(imagemin())
        .pipe(gulp.dest(publicRoot + 'images/svg'));
});


gulp.task('browser-sync', function () {
    browserSync({
        proxy: "localhost:3000",
        notify: false,
        debugInfo: false
    });
});


//Run if you need to remove static
gulp.task('clean', function () {
    return del([
        publicRoot + 'images',
        publicRoot + 'stylesheets',
        publicRoot + 'javascripts',
        publicRoot + 'video',
        publicRoot + 'fonts'
    ]);
});


//Run if you need to build static
gulp.task('build', ['images', 'js', 'js-components', 'css', 'fonts', 'static', 'video']);


gulp.task('watch', ['images', 'js', 'js-components', 'css', 'browser-sync'], function () {
    gulp.watch(assetsRoot + 'javascripts/*.js', ['js']);
    gulp.watch(assetsRoot + 'javascripts/components/*.js', ['js-components']);
    gulp.watch(assetsRoot + 'images/*', ['images']);
    gulp.watch(assetsRoot + 'stylesheets/**/*.scss', ['css']);
    gulp.watch(assetsRoot + 'fonts/*', ['fonts']);
});
