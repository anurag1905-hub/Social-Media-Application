const gulp = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const rev = require('gulp-rev');
const del = require('del');

gulp.task('css', function(done){
    gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./assets/'));

    return gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets/'))
    .pipe(rev.manifest('public/assets/rev-manifest.json', {
        base: './public/assets',
        merge: true // merge with the existing manifest (if one exists)
     }))
    .pipe(gulp.dest('./public/assets/'));
    done();
});

gulp.task('js', function (done) {
    gulp.src('./assets/**/*.js')
        .pipe(rev())
        .pipe(gulp.dest('./public/assets/'))
        .pipe(rev.manifest('public/assets/rev-manifest.json', {
            base: './public/assets',
            merge: true // merge with the existing manifest (if one exists)
        }))
        .pipe(gulp.dest('./public/assets/'));
    done()
});

gulp.task('images', function(done){
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets/'))
    .pipe(rev.manifest('public/assets/rev-manifest.json', {
        base: './public/assets',
        merge: true // merge with the existing manifest (if one exists)
     }))
    .pipe(gulp.dest('./public/assets/'));
    done();
});

// empty the public/assets directory
gulp.task('clean:assets', function(done){
    del.sync('./public/assets');
    done();
});

gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){
    console.log('Building assets');
    done();
});


