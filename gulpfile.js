'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

gulp.task('bs', function() {
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('styles', () => {
	return gulp.src('./styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./styles/'))
		// .pipe(reload({stream: true}));
});

gulp.task('watch',() => {
	gulp.watch('./styles/**/*.scss', ['styles']);
	// gulp.watch('./scripts/*.js', ['scripts']);
});

gulp.task('scripts', () => {
	gulp.src('./scripts/scripts.js')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('./scripts'))
});
