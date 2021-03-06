'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('production', ['clean'], function (cb) {

    global.isProd = true;

    runSequence(
        ['styles', 'images', 'fonts', 'views'],
        'browserify',
        'analytics',
        's3Paths',
        'gzip',
        cb);

});
