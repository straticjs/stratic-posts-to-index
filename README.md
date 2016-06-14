# `stratic-posts-to-index`

[Gulp][1] plugin to prepare Vinyl files with indexes of a stream of [Stratic][2] posts

## Installation

    npm install stratic-posts-to-index

## Usage

`gulpfile.js`:

```js
var gulp = require('gulp');
var straticPostsToIndex = require('stratic-posts-to-index');

gulp.task('post-index', function() {
    gulp.src('*.md')
        .pipe(straticPostsToIndex());
});
```

## License

LGPL 3.0+

## Author

Alex Jordan <alex@strugee.net>

 [1]: http://gulpjs.com/
 [2]: https://github.com/strugee/generator-stratic
