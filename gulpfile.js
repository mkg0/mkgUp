///////////////////////////////////////////////////////////////////////////
const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const minifycss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const sync = require('browser-sync').create();
const open = require('open');
const babel = require('gulp-babel');
const bowerfiles = require('main-bower-files');
const filter = require('gulp-filter');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const add = require('gulp-add-src');
const del = require('del');
const plumber = require('gulp-plumber');


///////////////////////////////////////////////////////////////////////////


var config = require('./package.json');
config.path= new function(){
  this.root= '';                                          //project root. './' kullanınca filterda eşleşme sorunu yaratıyor!
  this.source= this.root + 'src/';                        //project sources
  this.dist= this.root ;                                  //project publish root
  this.assets= this.dist;                                 //project assets
  this.build= this.assets + 'dist/';                     //project assets build
}


config.src={
  css:{
    path:                   config.path.source + 'css/',
    get:                    [config.path.source + 'css/**/*.css'],
    dist:                   config.path.build
  },
  scss:{
    path:                   config.path.source + 'scss/',
    get:                    [config.path.source + 'scss/**/*.scss'],
    dist:                   config.path.build
  },
  js:{
    path:                   config.path.source + 'js/',
    get:                    [config.path.source + 'js/**/*.js'],
    dist:                   config.path.build,
    concatName:             'mkgUp.js'
  },
  script:{
    path:                   config.path.source + 'script/',
    get:                    [
                              config.path.source + 'script/**/*.js'
                            ],
    main:                   [
                              config.path.source + 'script/mkgUp.js'
                            ],
    dist:                   config.path.build
  },
  html:{
    path:                   config.path.dist + '',
    get:                    [
                              config.path.dist + '*.html',
                              config.path.dist + 'demo/*.html'
    ]
  },
  img:{
    path:                   config.path.source + 'img/',
    get:                    [
                              config.path.source + 'img/**/*.jpg',
                              config.path.source + 'img/**/*.gif',
                              config.path.source + 'img/**/*.svg',
                              config.path.source + 'img/**/*.png'
                            ],
    dist:                   config.path.assets + 'img'
  },
}
config.src.bower = {
    concatName:'bowerBundle.js',
    dist: config.src.js.path
  }


///////////////////////////////////////////////////////////////////////////

gulp.task('bower-init',function(){
  gulp.src(bowerfiles())
  .pipe(filter('**/*.js'))
  .pipe(concat(config.src.bower.concatName))
  .pipe(uglify())
  .pipe(gulp.dest(config.src.js.path));

  gulp.src(bowerfiles())
  .pipe(filter('**/*.css'))
  .pipe(concat('.bower-bundle.css'))
  .pipe(minifycss())
  .pipe(rename({suffix:'.min'}))
  .pipe(gulp.dest(config.src.css.path));
})


gulp.task('html',function(){

})


gulp.task('sass', function () {
    gulp.src( config.src.scss.get)
      .pipe(sass({outputStyle: 'expanded',sourceMap:true}).on('error', sass.logError))
      .pipe(autoprefixer({browsers: ['last 10 versions'],cascade: false}))
      .pipe(gulp.dest(config.src.scss.dist))
      .pipe(minifycss())
      .pipe(rename({suffix:'.min'}))
      .pipe(gulp.dest(config.src.scss.dist))
      .pipe(sync.reload({stream:true}));
});


gulp.task('watch', function () {
    gulp.watch(config.src.scss.get, ['sass']);
    gulp.watch(config.src.css.get, ['concat-css']);
    gulp.watch(config.src.js.get, ['script-main']);
    gulp.watch(config.src.script.main, ['script-main']);
    gulp.watch(config.src.html.get, ['html']).on('change', sync.reload);
});

gulp.task('concat-css', function() {
  gulp.src(config.src.css.get)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(config.src.css.dist))
    .pipe(minifycss())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest(config.src.css.dist))
    .pipe(sync.reload({stream:true}));
});



gulp.task('minify-js',function(){
    gulp.src(config.path.build + '**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(config.path.build));
})

gulp.task('minify-css',function(){
    gulp.src(config.path.build + '**/*.css')
    .pipe(minifycss())
    .pipe(gulp.dest(config.path.build));
})

gulp.task('minify-img',function(){
    gulp.src(config.src.img.get)
    .pipe(imagemin())
    .pipe(gulp.dest(config.src.img.dist));
})

gulp.task('sync', function () {
    sync.init({
        server: {
          baseDir: config.path.dist
        },
    })
});

gulp.task('script-main', function () {
  gulp.src(config.src.script.main)
  .pipe(plumber())
  .pipe(babel())
  .pipe(add.prepend(config.src.js.get))
  .pipe(filter(['**', '!' + config.src.bower.dist + config.src.bower.concatName ]))//scriptin içerisindeki main harici dosyaların derlenmesi
  .pipe(add.prepend(config.src.bower.dist + config.src.bower.concatName ))
  .pipe(concat(config.src.js.concatName))
  .pipe(gulp.dest(config.path.build))
  .pipe(uglify())
  .pipe(rename({suffix:'.min'}))
  .pipe(gulp.dest(config.path.build))
  .pipe(sync.reload({stream:true}));
});

gulp.task('script-pages', function () {
  gulp.src(config.src.script.get)
  .pipe(filter(['**', ...config.src.script.main.map((x)=> '!' +x) ]))//scriptin içerisindeki main harici dosyaların derlenmesi
  .pipe(babel())
  .pipe(config.production ? uglify() : gutil.noop())
  .pipe(gulp.dest(config.src.script.dist))
  .pipe(sync.reload({stream:true}));
});

gulp.task('test', function () {

});






gulp.task('default', ['build','watch', 'sync']);
gulp.task('minify', ['minify-css','minify-js']);
gulp.task('concat', ['concat-css','script-main']);
gulp.task('bower',['bower-init','concat']);
gulp.task('script',['script-main', 'script-pages']);

gulp.task('build', ['sass','script','concat-css','minify-img'],function(){
  gutil.beep();
});
