const gulp = require('gulp');
const sass = require('gulp-sass');
const minifycss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const sync = require('browser-sync').create();
const open = require('open');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const del = require('del');
const plumber = require('gulp-plumber');


///////////////////////////////////////////////////////////////////////////


gulp.task('sass', function () {
    gulp.src('src/mkgUp.scss')
      .pipe(sass({outputStyle: 'expanded',sourceMap:true}).on('error', sass.logError))
      .pipe(autoprefixer({browsers: ['last 5 versions'],cascade: false}))
      .pipe(gulp.dest('dist'))
      .pipe(minifycss())
      .pipe(rename({suffix:'.min'}))
      .pipe(gulp.dest('dist'))
      .pipe(sync.reload({stream:true}));
});


gulp.task('watch', function () {
    gulp.watch('src/mkgUp.scss', ['sass']);
    gulp.watch('src/mkgUp.js', ['script']);
    gulp.watch('*.html').on('change', sync.reload);
});

gulp.task('sync', function () {
    sync.init({
        server: {
          baseDir: './',
          index:'demo/index.html'
        },
    })
});

gulp.task('script', function () {
  gulp.src('src/mkgUp.js')
  .pipe(plumber())
  .pipe(babel())
  .pipe(gulp.dest('dist'))
  .pipe(uglify())
  .pipe(rename({suffix:'.min'}))
  .pipe(gulp.dest('dist'))
  .pipe(sync.reload({stream:true}));
});

gulp.task('clear',function () {
  del('dist/**/*');
})
gulp.task('default', ['build','watch', 'sync']);
gulp.task('build', ['clear','sass','script']);
