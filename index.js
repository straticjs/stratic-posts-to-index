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

var through2 = require('through2');
var eos = require('end-of-stream');
var vfs = require('vinyl-fs');

module.exports = function(template, options) {
	if (typeof template !== 'string') throw new Error('template not specified');

	// Open template stream early for read performance
	var templateStream = vfs.src(template);

	var files = [];
	var that;
	var callback;

	var attachFiles = through2.obj(function(file, enc, _callback) {
		file.data = file.data || {};
		file.data.posts = files;

		console.log('Pushing file:', file.inspect());

		that.push(file);

		_callback();
	});

	// For each file that comes through, add it to an array
	var stream = through2.obj(function(file, enc, _callback) {
		that = this;

		files.push(file);

		callback = _callback;
	});

	// Wait until all files have come through, then pipe to the attacher
	eos(stream, function(err) {
		if (err) throw err;

		templateStream.pipe(attachFiles);

		callback();
	});

	return stream;
};
