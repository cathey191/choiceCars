//Gulp Variables
var gulp = require('gulp');
sass = require('gulp-sass');
livereload = require('gulp-livereload');
connect = require('gulp-connect');
jshint = require('gulp-jshint');
rename = require('gulp-rename');
minifyCss = require('gulp-minify-css');
minifyJS = require('gulp-minify');

//Server Task
gulp.task('serve', function(event) {
	connect.server({
		root: '',
		port: 1988,
		livereload: true
	});
});

//Styles Task
gulp.task('styles', function() {
	gulp
		.src('sass/**/style.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifyCss())
		.pipe(gulp.dest('css/'))
		.pipe(connect.reload());
});

//HTML Task
gulp.task('html', function() {
	gulp.src('./*.html').pipe(connect.reload());
});

//JS Lint Task for correcting and monitoring your custom.js
gulp.task('lint', function() {
	gulp
		.src('js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(connect.reload());
});

//Minify js
gulp.task('compress', function() {
	gulp
		.src(['jsHand/*.js'])
		.pipe(
			minifyJS({
				ignoreFiles: ['.combo.js', '-min.js']
			})
		)
		.pipe(gulp.dest('js/'));
});

//Watch task to watch for file changes
gulp.task('watch', function() {
	gulp.watch('sass/**/*.scss', ['styles']);
	gulp.watch('./*.html', ['html']);
	gulp.watch('jsHand/*.js', ['lint', 'compress']);
});

// gulp.task('default', ['serve', 'styles', 'html', 'lint', 'watch']);
gulp.task('default', ['serve', 'styles', 'html', 'watch']);
