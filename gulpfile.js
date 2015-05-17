var gulp = require('gulp'),
	ngdocs = require('gulp-ngdocs'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	Dgeni = require('dgeni'),
	debug = true,
	PATHS = {
		JS:{
			LIB:['./components/**/*.min.js'],
			SRC:['./src/*.js','./src/**/*.js']
		}
	};

gulp.task('concat-lib',function(){
	gulp.src(PATHS.JS.LIB)
		.pipe(concat('lib.min.js'))
		.pipe(gulp.dest('./dist/scripts'));
});

gulp.task('dgeni', function() {
  try {
    var dgeni = new Dgeni([require('./docs/config')]);
    return dgeni.generate();
  } catch(x) {
    console.log(x.stack);
    throw x;
  }
});

gulp.task('concat-src', function() {
	if (debug){
	    gulp.src(PATHS.JS.SRC)
	      .pipe(concat('app.min.js'))
	      .pipe(gulp.dest('./dist/scripts'));
	}else {
		gulp.src(PATHS.JS.SRC)
	      .pipe(concat('app.min.js'))
	      .pipe(uglify())
	      .pipe(gulp.dest('./dist/scripts'));
	}
});

gulp.task('docs', function() {
	var options = {
    scripts: ['./dist/scripts/app.min.js'],
    html5Mode: false,
    startPage: '/api',
    title: "ngSuh",
    titleLink: "/api"
  };
    return gulp.src(['./src/*.js','./src/**/*.js'])
    		.pipe(ngdocs.process(options))
    		.pipe(gulp.dest('docs'));
});

gulp.task('watch', function() {
    gulp.watch('./src/**', ['docs','concat-lib','concat-src']);
});

gulp.task('default',['watch'],function(){

});