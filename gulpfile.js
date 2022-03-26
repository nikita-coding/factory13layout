const
    gulp = require('gulp'),
    pug = require('gulp-pug'),
    path = require('path'),
    browserSync = require('browser-sync'),
    gulpIf = require('gulp-if'),

    minifyCss = require('gulp-minify-css'),
    sass = require('gulp-sass')(require('sass')),
    sourcemaps = require('gulp-sourcemaps'),
    clean = require('gulp-clean'),
    autoprefixer = require('gulp-autoprefixer'),

    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),

    changed = require('gulp-changed'),

    //webpack = require('webpack'),
    webpackStream = require('webpack-stream'),

    { VueLoaderPlugin } = require('vue-loader'),


    // variables
    buildPath = 'dist',

    pugPath = 'src/pages/*.pug',
    allPugPath = 'src/pages/**/*.pug',

    sassPath = 'src/sass/*.{scss,sass}',
    sassWatchPath = 'src/sass/**/*.{scss,sass}',
    cssPath = buildPath+'/assets/css/',

    imgPath = 'src/img/**/*.{jpg,jpeg,png,gif,tiff,svg,webp}',
    imgBuildPath = buildPath+'/assets/img/',

    jsPathApp = 'src/js/App.js',
    jsBuildPath = path.resolve(__dirname, buildPath+'/assets/js/'),

    fontsPath = "src/fonts/**/*.*",
    fontsBuildPath = buildPath+"/assets/fonts/"

let
    production_mode = false

function pugF() {
    return gulp.src(pugPath)
        .pipe(pug())
        .pipe(gulp.dest(buildPath))
}
gulp.task('pug', (cb) => {
    pugF()
    cb();
})

function sassF() {
    return gulp.src(sassPath)
        .pipe(gulpIf(!production_mode, sourcemaps.init()))
        .pipe(sass())
        .pipe(gulpIf(production_mode, autoprefixer()))
        .pipe(gulpIf(production_mode, minifyCss({keepSpecialComments : 0, processImport: false})))
        .pipe(gulpIf(!production_mode, sourcemaps.write('.')))
        .pipe(gulp.dest(cssPath))
        // сносим карты сайта для продакшна
        .pipe(gulpIf(production_mode, gulp.src(cssPath+'*.map', {read: false}).pipe(clean({force: true}))));
}
gulp.task('sass', (cb) => {
    sassF()
    cb();
})

function imgF() {
    return gulp.src(imgPath)
        .pipe(changed(imgBuildPath))
        .pipe(imagemin({
            lossless: true,
            quality: 100,
            alphaQuality: 100
        }))
        .pipe(gulp.dest(imgBuildPath))
        .pipe(webp({
            //lossless: true,
            quality: 100,
            alphaQuality: 100,
            method: 6,
        }))
        .pipe(gulp.dest(imgBuildPath))
}
gulp.task('img', (cb) => {
    imgF();
    cb();
})

function jsF(watch = false) {
    let webpack_mode;
    if(production_mode) webpack_mode = 'production';
    else webpack_mode = 'development';

    return gulp.src(jsPathApp)
        .pipe(webpackStream({
            output: {
                filename: 'app.js',
                path: jsBuildPath,
            },
            resolve: {
                extensions: ['.js', '.vue', '/index.js', '/index.vue']
            },
            mode: webpack_mode, // development or production
            watch: watch,
            module: {
                rules: [
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader'
                    },
                    {
                        test: /\.(js)$/,
                        exclude: /(node_modules)/,
                        use: [{
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }]
                    },
                    {
                        test: /\.css$/,
                        use: [
                            'vue-style-loader',
                            'css-loader'
                        ]
                    },
                    {
                        test: /\.pug$/,
                        loader: 'pug-plain-loader'
                    }
                ]
            },
            externals: {
                jquery: 'jQuery',
            },
            plugins: [
                new VueLoaderPlugin()
            ],
        }))
        .pipe(gulp.dest(jsBuildPath));
}
gulp.task('js', (cb) => {
    jsF()
    cb();
})

function serveF() {
    browserSync.init({
        server: {
            baseDir: buildPath,
        },
    })

    watchF();

    gulp.watch(buildPath, () => {}).on('change', browserSync.reload)
    gulp.watch(cssPath, () => {}).on('change', browserSync.reload)
    gulp.watch(imgBuildPath, () => {}).on('change', browserSync.reload)
    gulp.watch(jsBuildPath, () => {}).on('change', browserSync.reload)
}
gulp.task('serve', () => {
    serveF()
})

function watchF() {
    copyFontsF()
    gulp.watch(allPugPath, gulp.parallel('pug'))
    gulp.watch(sassWatchPath, gulp.parallel('sass'))
    gulp.watch(imgPath, gulp.parallel('img'))
    // gulp.watch(jsPath, gulp.parallel('js'))
    jsF(true)
}
gulp.task('watch', () => {
    watchF()
})

function copyFontsF() {
    return gulp.src(fontsPath)
        .pipe(gulp.dest(fontsBuildPath))
}

gulp.task('copy_fonts', cb => {
    copyFontsF()
    cb()
});

function compile_all(is_prod = false) {
    production_mode = is_prod

    pugF()
    sassF()
    imgF()
    jsF()
    copyFontsF()
}

gulp.task('dev', (cb) => {
    compile_all(false)
    cb()
})

gulp.task('build', (cb) => {
    compile_all(true)
    cb()
})