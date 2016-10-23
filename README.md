# `stratic-posts-to-index`

[Gulp][1] plugin to prepare Vinyl files with indexes of a stream of [Stratic][2] posts

## Installation

    npm install stratic-posts-to-index

## Example

Minimal example:

```js
var gulp = require('gulp');
var parseStratic = require('stratic-parse-header');
var straticPostsToIndex = require('stratic-posts-to-index');
var addsrc = require('gulp-add-src');
var straticDateInPath = require('stratic-date-in-path');

gulp.task('post-index', function() {
	return gulp.src(*.md')
	           .pipe(parseStratic())
	           .pipe(straticDateInPath())
	           .pipe(addsrc('src/blog/index.jade'))
	           .pipe(postsToIndex('index.jade'))
});
```

Full example:

```js
var gulp = require('gulp');
var remark = require('gulp-remark');
var remarkHtml = require('remark-html');
var parseStratic = require('stratic-parse-header');
var straticPostsToIndex = require('stratic-posts-to-index');
var addsrc = require('gulp-add-src');
var jade = require('gulp-jade');
var straticDateInPath = require('stratic-date-in-path');

gulp.task('post-index', function() {
	return gulp.src(*.md')
	           .pipe(parseStratic())
	           .pipe(remark().use(remarkHtml))
	           .pipe(straticDateInPath())
	           .pipe(addsrc('index.jade'))
	           .pipe(postsToIndex('index.jade'))
	           .pipe(jade({basedir: __dirname}))
	           .pipe(rename({ extname: '.html' }))
	           .pipe(gulp.dest('dist'));
});
```

What's happening here? First we read in the Stratic posts from disk, render them as Markdown, and put the date in their path. Then we add `index.jade` into the stream of files. `index.jade` is what will be used for the template.

When we pipe all the files to `postsToIndex`, we pass it the name of the template file. From there, `stratic-posts-to-index` will output copies of this template, one for each index page. See "Locals" below for information on the locals that are provided to the template.

The rest is just standard Gulp: we render the Jade, rename the templates to `.html` files, and write to the `dist` directory.

## License

LGPL 3.0+

## Author

Alex Jordan <alex@strugee.net>

 [1]: http://gulpjs.com/
 [2]: https://github.com/strugee/generator-stratic
