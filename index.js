/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

var path = require('path');
if (!Array.prototype.includes) require('es7-array.prototype.includes');
var through2 = require('through2');
var eos = require('end-of-stream');
var gutil = require('gulp-util');

module.exports = function(template, options) {
	if (typeof template !== 'string') throw new Error('template not specified');

	var files = [];
	var templateFile;

	// For each file that comes through, add it to an array
	var stream = through2.obj(function(file, enc, callback) {
		// Check if the file is the template file
		if (file.relative === template) {
			templateFile = file;
		} else {
			files.push(file);
		}

		callback();
	},
	// Wait until all files have come through, then attach the non-template files
	function(callback) {
		if (!templateFile) throw new Error('template not found in stream');

		templateFile.data = templateFile.data || {};

		// Main index
		var mainIndexFile = templateFile.clone();
		mainIndexFile.data.posts = files;
		mainIndexFile.indexType = 'main';
		this.push(mainIndexFile);

		// Years
		var years = [];
		files.forEach(function(post) {
			var year = new Date(post.time.epoch * 1000).getFullYear();
			if (!years.includes(year)) years.push(year);
		});

		years.forEach(function(year) {
			var file = templateFile.clone();

			file.data.posts = files.filter(function(post) {
				return year === new Date(post.time.epoch * 1000).getFullYear();
			});

			var yearStr = year.toString();

			file.path = path.join(file.base, yearStr, file.relative);
			file.indexType = 'year';

			this.push(file);
		}, this);

		// Months
		// Map keys are years that posts have been authored in, value is array of months in that year
		var months = new Map();
		files.forEach(function(post) {
			var date = new Date(post.time.epoch * 1000);
			var year = date.getFullYear();
			var month = date.getMonth();

			if (!months.get(year)) months.set(year, []);

			if (!months.get(year).includes(month)) months.get(year).push(month);
		});

		months.forEach(function(monthsInYear, year) {
			monthsInYear.forEach(function(month) {
				var file = templateFile.clone();

				file.data.posts = files.filter(function(post) {
					var date = new Date(post.time.epoch * 1000);
					var postYear = date.getFullYear();
					var postMonth = date.getMonth();

					return year === postYear && month === postMonth;
				});

				var yearStr = year.toString();
				var monthStr = month + 1;
				monthStr = monthStr < 10 ? '0' + monthStr.toString() : monthStr.toString();

				file.path = path.join(file.base, yearStr, monthStr, file.relative);
				file.indexType = 'month';

				this.push(file);
			}, this);
		}, this);

		// Categories
		// TODO

		callback();
	});

	return stream;
};
