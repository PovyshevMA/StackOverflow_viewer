var config = {
    js: {
        shouldMinify: false,
        libs: [
            'bower_components/angular/angular.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-route/angular-route.js',
        ],
        minLibsFile: 'js/libs.js',
        appFile: 'app/app.js',
        appMinFile: 'js/app.js',
        componentsFiles: 'app/**/*.js',
        compiledPath: 'js/'
    },
    css: {
        shouldMinify: false,
        appFile: 'app/app.scss',
        componentFiles: 'app/**/*.scss',
        libs: [
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            'bower_components/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        minAppFile: 'css/all.css',
        minLibsFile: 'libs.css',
        compiledPath: 'css/'
    }
};

var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    concat = require("gulp-concat"),
    gulpif = require('gulp-if'),
    minifyCss = require('gulp-csso'),
    minifyJs = require("gulp-uglify"),
    plumber = require('gulp-plumber'),
    rename = require("gulp-rename"),
    rimraf = require("rimraf"),
    sass = require('gulp-sass'),
    sassGlob = require('gulp-sass-glob'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util');


// Объединение стилей библиотек в 1 файл.
gulp.task('css:libs', function () {
    gulp.src(config.css.libs)
        .pipe(sourcemaps.init())
        .pipe(concat(config.css.minLibsFile))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.css.compiledPath));
});
// Компиляция Sass файлов.
gulp.task('css:components', function () {
    gulp.src(config.css.appFile)
        .pipe(plumber())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions', '> 1%'))
        .pipe(gulpif(config.css.shouldMinify, minifyCss()))
        .pipe(rename(config.css.minAppFile))
        .pipe(gulp.dest("."));
});
gulp.task("css", ["css:libs", "css:components"]);

// Объединение библиотек в 1 файл.
gulp.task("js:libs", ["remove-readonly-attr"], function () {
    gulp.src(config.js.libs, { base: "." })
        .pipe(concat(config.js.minLibsFile))
        .pipe(gulpif(config.js.shouldMinify, minifyJs()))
        .pipe(gulp.dest("."));
});
// Компиляция с модульной системой CommonJS и поддержкой синтаксиса ES2015.
gulp.task("js:components", ["remove-readonly-attr"], function () {
    // debug: true - добавляет sourcemap для удобной отладки.
    browserify({
        entries: config.js.appFile,
        extensions: ['.js'],
        debug: true,
        paths: ['./app/']
    })
        .transform(babelify)
        .bundle()
        .pipe(source(config.js.appMinFile))
        .pipe(gulp.dest('.'));
});

gulp.task("js:components:watch", ["remove-readonly-attr"], function () {
    // debug: true - добавляет sourcemap для удобной отладки.
    var b = browserify({
        entries: config.js.appFile,
        extensions: ['.js'],
        debug: true,
        paths: ['./app/'],
        cache: {},
        packageCache: {}
    });

    b.transform(babelify);

    b.plugin(watchify);
    b.on('update', bundle);
    b.on('log', function (msg) {
        gutil.log(msg);
    });

    bundle();

    function bundle() {
        b.bundle()
            .on("error", function (err) {
                gutil.log("Browserify error:", gutil.colors.red(err.toString()));
            })
            .pipe(source(config.js.appMinFile))
            .pipe(gulp.dest('.'));
    }
});

gulp.task("js", ["js:libs", "js:components"]);


gulp.task('remove-readonly-attr', function () {
    require("child_process").exec("attrib -r " + config.js.compiledPath + "\*.* /s");
    require("child_process").exec("attrib -r " + config.css.compiledPath + "\*.* /s");
});

gulp.task("clean:js", ["remove-readonly-attr"], function (cb) {
    rimraf(config.js.compiledPath, cb);
});
gulp.task("clean:css", ["remove-readonly-attr"], function (cb) {
    rimraf(config.css.compiledPath, cb);
});



gulp.task("clean", ["clean:js", "clean:css"]);
gulp.task("compile", ["js", "css"]);
gulp.task('watch', ['js:components:watch'], function () {
    gulp.watch(config.css.componentFiles, ['css:components']);
});

