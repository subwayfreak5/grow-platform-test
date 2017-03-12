var gulp = require('gulp');

gulp.task('js-compile', function () {
  return gulp.src(
    ['./source/js/main.js']
  )
    .pipe(gulp.dest('./source/js'));
});

gulp.task('build', ['js-compile']);
gulp.task('default', ['js-compile']);
