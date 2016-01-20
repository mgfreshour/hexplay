'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');

var wwwServer, seleniumServer;

var jasmine = require('gulp-jasmine');
gulp.task('test-server', function () {
    return gulp.src(['routes/**/*.spec.js'])
        .pipe(jasmine()); // gulp-jasmine works on file-paths so you can't have any plugins before it
});

var karma = require('karma').Server;
gulp.task('test-client', function (done) {
    new karma({
        configFile: __dirname + '/karma.conf.js',
        singleRun: false
    }, done).start();
});

var nodeMon = require('nodemon');
gulp.task('www', function () {
    wwwServer = nodeMon({
        script: 'bin/www',
        ext: 'js html',
        env: { 'NODE_ENV': 'development' }
    });
});

var eslint = require('gulp-eslint');
gulp.task('lint', function() {
    return gulp.src(['**/*.js','!node_modules/**', '!public/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

var webpack = require('webpack');
gulp.task('webpack', function(callback) {
    webpack(require('./webpack.config.js'), function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString());
        callback();
    });
});

var fs = require('fs-extra');
gulp.task('clean', function (done) {
    return fs.remove('public', done);
});

var selenium = require('selenium-standalone');
gulp.task('selenium', function (done) {
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
gulp.task('e2e', ['www', 'selenium'], function () {
    return gulp.src('wdio.conf.js')
        .pipe(webdriver())
        .on('error', function () {
            seleniumServer.kill();
            process.exit(1);
        });
});

gulp.task('test:e2e', ['clean', 'webpack', 'e2e'], function () {
    wwwServer.reset();
    seleniumServer.kill();
    process.exit(1);
});
