var gulp = require('gulp'),
	ngdocs = require('gulp-ngdocs'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	Dgeni = require('dgeni'),
	debug = false,
	PATHS = {
		JS:{
			LIB:['./components/**/*.min.js'],
			SRC:['./src/*.js','./src/**/*.js']
		}
	};

gulp.task('concat-lib',function(){
	gulp.src(PATHS.JS.LIB)
		.pipe(concat('lib.min.js'))
		.pipe(gulp.dest('./lib'));
});

gulp.task('dev-js', function() {
    gulp.src(PATHS.JS.SRC)
      .pipe(concat('shtranslate.js'))
      .pipe(gulp.dest('./dist'));
});

gulp.task('dist-js',function(){
	gulp.src(PATHS.JS.SRC)
		.pipe(concat('shtranslate.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist'));
});

gulp.task('docs', function() {
	var options = {
    scripts: ['./dist/shtranslate.js'],
    html5Mode: false,
    startPage: '/api',
    title: "ngTranslate",
    titleLink: "/api"
  };
    return gulp.src(['./src/*.js','./src/**/*.js'])
    		.pipe(ngdocs.process(options))
    		.pipe(gulp.dest('docs'));
});

gulp.task('watch', function() {
    gulp.watch('./src/**', ['docs','concat-lib','dev-js', 'dist-js']);
});

gulp.task('default',['watch'],function(){

});