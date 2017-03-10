var gulp = require('gulp');
var closureCompiler = require('gulp-closure-compiler');

gulp.task('js-compile', function () {
  return gulp.src(
    ['./source/js/main.js',
    './source/js/closure-library/closure/goog/**/*.js']
  )
    .pipe(closureCompiler({
        compilerPath: '/usr/local/closure/compiler.jar',
        fileName: 'main.min.js',
        compilerFlags: {
         closure_entry_point: 'app.Main',
         compilation_level: 'ADVANCED',
         language_in: 'ECMASCRIPT5',
         generate_exports: true,
         manage_closure_dependencies: true,
         only_closure_dependencies: true
       },
       continueWithWarnings: true,
       tieredCompilation: true,
       export_local_property_definitions: true
      }))
    .pipe(gulp.dest('./source/js'));
});

gulp.task('build', ['js-compile']);
gulp.task('default', ['js-compile']);
