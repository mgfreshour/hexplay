'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var merge = require('merge2');

var wwwServer, seleniumServer;

// TESTING --------------------------------------------------

var jasmine = require('gulp-jasmine');
gulp.task('test:server', ['compile:server'], function () {
    return gulp.src(['build/routes/**/*.spec.js'])
        .pipe(jasmine()); // gulp-jasmine works on file-paths so you can't have any plugins before it
});

var Karma = require('karma').Server;
gulp.task('test:client', function (done) {
    var runner = new Karma({
        configFile: __dirname + '/karma.conf.js',
        singleRun: !gutil.env.watch,
    }, function () {
        done();
        gutil.env.single && process.exit(0); // stupid work-around for https://github.com/karma-runner/karma/issues/1788
    });
    runner.start();
});


var selenium = require('selenium-standalone');
gulp.task('inner:selenium', function (done) {
    selenium.install({logger: console.log}, function () {
        console.log('Launching Selenium at localhost:4444/wd/hub');
        selenium.start(function (err, child) {
            if (err) {
                return done(err);
            }
            seleniumServer = child;
            done();
        });
    });
});
var webdriver = require('gulp-webdriver');
gulp.task('inner:e2e', ['www', 'inner:selenium'], function () {
    return gulp.src('wdio.conf.js')
        .pipe(webdriver())
        .on('error', function () {
            seleniumServer.kill();
            process.exit(1);
        });
});
gulp.task('test:e2e', ['compile:client', 'inner:e2e'], function () {
    wwwServer.reset();
    seleniumServer.kill();
    process.exit(0);
});

// COMPILING --------------------------------------------------

var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
gulp.task('compile:server', function () {
    var tsResult = gulp.src(['**/*.ts', '!**/*.spec.ts', '!node_modules/**'])
        .pipe(ts(tsProject));

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
        tsResult.dts.pipe(gulp.dest('build/definitions')),
        tsResult.js.pipe(gulp.dest('build'))
    ]);
});

var webpack = require('webpack');
gulp.task('compile:client', function(callback) {
    webpack(require('./webpack.config.js'), function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[compile:client]', stats.toString());
        callback();
    });
});

gulp.task('compile', ['compile:client', 'compile:server']);


// LINTING --------------------------------------------------

var tslint = require('gulp-tslint');
gulp.task('lint', () =>
    gulp.src(['**/*.ts', '!**/*.spec.ts', '!node_modules/**', '!typings/**'])
        .pipe(tslint())
        .pipe(tslint.report('verbose'))
);

// RUNNING --------------------------------------------------

var nodeMon = require('nodemon');
gulp.task('www', function () {
    wwwServer = nodeMon({
        script: 'bin/www',
        ext: 'js html',
        env: { 'NODE_ENV': 'development' },
    });
});

gulp.task('watch', ['compile', 'www'], function() {
    gulp.watch('**/*.ts', ['compile']);
});


// CLEANING --------------------------------------------------

var fs = require('fs-extra');
gulp.task('clean:public', function (done) {
    return fs.emptyDir('public', done);
});
gulp.task('clean:build', function (done) {
    return fs.emptyDir('build', done);
});
gulp.task('clean', ['clean:public', 'clean:build']);


