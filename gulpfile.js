import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import nodeSass from 'node-sass';
import autoprefixer from 'gulp-autoprefixer';
import minify from 'gulp-clean-css';
import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminOptipng from 'imagemin-optipng';
import webp from 'gulp-webp';
import browserSyncc from 'browser-sync';

const sass = gulpSass(nodeSass)
const browserSync = browserSyncc.create()

export function style() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(minify())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream())
}

export function optimizeImage() {
    return gulp.src('src/images/*.{jpg,png}')
        .pipe(imagemin([
            imageminMozjpeg({quality: 80, progressive: true}),
            imageminOptipng({optimizationLevel: 2})
        ]))
        .pipe(gulp.dest('dist/images'))
}

export function webpImage() {
    return gulp.src('dist/images/*.{jpg,png}')
        .pipe(webp())
        .pipe(gulp.dest('dist/images'))

}

export function watch() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    })
    gulp.watch('src/scss/**/*.scss', style)
    gulp.watch('src/images/*.{jpg,png}', optimizeImage)
    gulp.watch('dist/images/*.{jpg,png}', webpImage)
    gulp.watch('./js/**/*.js').on('change', browserSync.reload)
    gulp.watch('./*html').on('change', browserSync.reload)
}
