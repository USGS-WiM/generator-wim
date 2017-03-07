var gulp = require('gulp'),
    git = require('gulp-git'),
    bump = require('gulp-bump'),
    jshint = require('gulp-jshint'),
    size = require('gulp-size'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    cleanCSS = require('gulp-clean-css'),
    connect = require('gulp-connect'),
    autoprefixer = require('gulp-autoprefixer'),
    filter = require('gulp-filter'),
    del = require('del'),
    open = require('open'),
    semver = require('semver'),
    replace = require('gulp-string-replace'),
    stylish = require('jshint-stylish'),
    less = require('gulp-less');

//get current app version
var version = require('./package.json').version;

//function for version lookup and tagging
function inc(importance) {
    //get new version number
    var newVer = semver.inc(version, importance);

    //bump appConfig version
    // gulp.src('**/**/appConfig.js')
    //     .pipe(replace(/app.version = '([^']+)'/g, "app.version = '" + newVer + "'"))
    //     .pipe(gulp.dest('src/scripts'))
    //     .pipe(gulp.dest('build/scripts'))

    gulp.src('src/scripts/appConfig.js')
        .pipe(replace(/app.version = '([^']+)'/g, "app.version = '" + newVer + "'"))
        .pipe(gulp.dest('src/scripts'))

    gulp.src('build/scripts/appConfig.js')
        .pipe(replace(/app.version = '([^']+)'/g, "app.version = '" + newVer + "'"))
        .pipe(gulp.dest('build/scripts'))

    // get all the files to bump version in 
    gulp.src(['package.json'])
        // bump the version number in those files 
        .pipe(bump({ type: importance }))
        // save it back to filesystem 
        .pipe(gulp.dest(function(file) {
            return file.base;
        }))
        // commit the changed version number 
        .pipe(git.commit('Release v' + newVer))
        // **tag it in the repository** 
        //.pipe(git.tag('v' + newVer));
        .pipe(git.tag('v' + newVer, 'Version message', function (err) {
            if (err) throw err;
        }));
}

//tasks for version tags
gulp.task('patch', ['build'], function () { return inc('patch'); });
gulp.task('feature', ['build'], function () { return inc('minor'); });
gulp.task('release', ['build'], function () { return inc('major'); });

//copy leaflet images
gulp.task('leaflet', function() {
    return gulp.src('node_modules/leaflet/dist/images/*.*')
        .pipe(gulp.dest('src/images'));
});

//less compilation
gulp.task('less', function () {
    return gulp.src(['node_modules/wim-mapper-styles/less/base.less'])
        .pipe(less())
        .pipe(gulp.dest('src/styles'))
        .pipe(gulp.dest('build/styles'))
});

// Styles
gulp.task('styles', function () {
    return gulp.src(['src/styles/main.css'])
        .pipe(autoprefixer('last 1 version'))
        .pipe(gulp.dest('src/styles'))
        .pipe(size());
});

// Icons
gulp.task('icons', function () {
    return gulp.src(['node_modules/bootstrap/dist/fonts/*.*', 'node_modules/fontawesome/fonts/*.*'])
        .pipe(gulp.dest('build/fonts'));
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src(['src/scripts/**/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(stylish))
        .pipe(size());
});

// HTML
gulp.task('html', ['styles', 'scripts', 'icons'], function () {
    var jsFilter = filter('**/*.js', { restore: true });
    var cssFilter = filter('**/*.css', { restore: true });

    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(cleanCSS({ processImport: false }))
        .pipe(cssFilter.restore)
        .pipe(gulp.dest('build'))
        .pipe(size());
});

// Images
gulp.task('images', function () {
    return gulp.src([
        'src/images/**/*',
        'src/lib/images/*'])
        .pipe(gulp.dest('build/images'))
        .pipe(size());
});

// appConfig
gulp.task('appConfig', function () {
    return gulp.src(['src/scripts/appConfig.js'])
        .pipe(gulp.dest('build/scripts'))
});

// Clean
gulp.task('clean', function(cb) {
    return del(['build'], cb);
});

// Build
gulp.task('build', ['clean'], function () {
    gulp.start('html', 'images', 'less', 'leaflet', 'appConfig');
});

// Default task
gulp.task('default', ['build']);

// Connect
gulp.task('connect', function(){
    connect.server({
        root: 'src',
        port: 9000,
        livereload: true,
        middleware: function(connect) {
            return [connect().use('/node_modules', connect.static('node_modules'))];
        }
    });
});

// Open
gulp.task('serve', ['connect'], function() {
    open("http://localhost:9000");
});

// Inject components
gulp.task('wiredep', function () {
    gulp.src('src/styles/*.css')
        .pipe(wiredep({
            directory: 'src/node_modules',
            ignorePath: 'src/node_modules/'
        }))
        .pipe(gulp.dest('src/styles'));

    gulp.src('src/*.html')
        .pipe(wiredep({
            directory: 'src/node_modules',
            ignorePath: 'src/'
        }))
        .pipe(gulp.dest('src'));
});

// Watch
gulp.task('watch', ['less', 'connect', 'serve'], function () {
    // Watch for changes in `app` folder
    gulp.watch([
        'src/*.html',
        'src/styles/**/*.css',
        'src/less/**/*.less',
        'src/scripts/**/*.js',
        'src/images/**/*'
    ], function (event) {
        return gulp.src(event.path)
            .pipe(connect.reload());
    });

    // Watch .css files
    gulp.watch('src/styles/**/*.css', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

});