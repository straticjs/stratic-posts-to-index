# `stratic-posts-to-index`

[Gulp][1] plugin to prepare Vinyl files with indexes of a stream of [Stratic][2] posts

## Installation

    npm install stratic-posts-to-index

## Example

Minimal example:

```js
var gulp = require('gulp');
var frontMatter = require('gulp-gray-matter');
var straticPostsToIndex = require('stratic-posts-to-index');
var addsrc = require('gulp-add-src');
var straticDateInPath = require('stratic-date-in-path');

gulp.task('post-index', function() {
	return gulp.src('*.md')
	           .pipe(frontMatter())
	           .pipe(straticDateInPath())
	           .pipe(addsrc('src/blog/index.jade'))
	           .pipe(straticPostsToIndex('index.jade'))
});
```

Full example:

```js
var gulp = require('gulp');
var remark = require('gulp-remark');
var remarkHtml = require('remark-html');
var frontMatter = require('gulp-gray-matter');
var straticPostsToIndex = require('stratic-posts-to-index');
var addsrc = require('gulp-add-src');
var jade = require('gulp-jade');
var straticDateInPath = require('stratic-date-in-path');
var rename = require('gulp-rename');

gulp.task('post-index', function() {
	return gulp.src('*.md')
	           .pipe(frontMatter())
	           .pipe(remark().use(remarkHtml))
	           .pipe(straticDateInPath())
	           .pipe(addsrc('index.jade'))
	           .pipe(straticPostsToIndex('index.jade'))
	           .pipe(jade({basedir: __dirname}))
	           .pipe(rename({ extname: '.html' }))
	           .pipe(gulp.dest('dist'));
});
```

What's happening here? First we read in the Stratic posts from disk, render them as Markdown, and put the date in their path. Then we add `index.jade` into the stream of files. `index.jade` is what will be used for the template.

When we pipe all the files to `postsToIndex`, we pass it the name of the template file. From there, `stratic-posts-to-index` will output copies of this template, one for each index page. See "Locals" below for information on the locals that are provided to the template.

The rest is just standard Gulp: we render the Jade, rename the templates to `.html` files, and write to the `dist` directory.

## Locals

Each template file gets some information as an object in its `data` attribute. Most template system plugins will use this object as locals for the template being rendered.

`posts` (`Array`) - the posts that should be included in that particular index, presorted in reverse-chronological order

`indexType` (`String`) - the type of index this is. The value will be one of `main`, `year`, `month`, or `category`.

`includedYears` (`Array`) - years that the posts included in the index were authored in (set for `main` indexes)

`includedMonths` (`Array`) - months that the posts included in the index were authored in (set for `main` and `year` indexes)

`includedCategories` (`Array`) - categories that the posts included in the index were categorized as (set for `main`, `year` and `month` indexes)

`year` (`Number`) - the year that the index is for (set for `year` and `month` indexes)

`month` (`Number`) - the (zero-based) month that the index is for (set for `month` indexes)

`category` (`String`) - the category that the index is for (set for `category` indexes)

## Code of Conduct

Please note that StraticJS is developed under the [Contributor Covenant][3] Code of Conduct. Project contributors are expected to respect these terms.

For the full Code of Conduct, see [CODE_OF_CONDUCT.md][4]. Violations may be reported to <alex@strugee.net>.

## License

LGPL 3.0+

## Author

AJ Jordan <alex@strugee.net>

 [1]: http://gulpjs.com/
 [2]: https://github.com/strugee/generator-stratic
 [3]: http://contributor-covenant.org/
 [4]: https://github.com/straticjs/stratic-posts-to-index/blob/master/CODE_OF_CONDUCT.md
