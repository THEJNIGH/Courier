var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('server', function() {
  nodemon({
    script: 'server.js',
    ext: 'js',
    ignore: ['ng*', 'gulp*', 'www*']
  });
});

gulp.task('js:build', function() {
  return gulp.src(['./ng/module.js', './ng/**/*.js'])
    .pipe(ngAnnotate())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./www/js/'));
})

gulp.task('default', ['server', 'js:build']);
