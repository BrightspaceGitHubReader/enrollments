/* eslint-env node, es6 */

'use strict';

const del = require('del');
const gulp = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const mergeStream = require('merge-stream');
const requireDir = require('require-dir');

const buildDirectory = '/../build';
const sergeDirectories = require('./enrollments.serge.json');

var buildSeries = ['clean'];
var cleanSeries = [];

sergeDirectories.forEach((sergeComponent) => {
	var localeResources = requireDir(sergeComponent.source_dir);
	var config = {
		dest: sergeComponent.source_dir + buildDirectory,
		localeFiles: Object.keys(localeResources).map((lang) => ({
			filename: lang,
			data: {
				lang: lang,
				name: sergeComponent.name,
				properLang: lang.charAt(0).toUpperCase() + lang.slice(1).replace('-', ''),
				resources: JSON.stringify(localeResources[lang], null, '\t\t\t\t'),
				comment: 'This file is auto-generated. Do not modify.'
			}
		}))
	};

	buildSeries.push(() => {
		const options = {
			client: true,
			strict: true,
			root: sergeComponent.source_dir + buildDirectory + '/lang',
			localsName: 'data'
		};

		return mergeStream(config.localeFiles.map(({ filename, data }) =>
			gulp.src('./templates/lang-behavior.ejs')
				.pipe(ejs(data, options))
				.pipe(rename({
					basename: filename,
					extname: '.html'
				}))
				.pipe(gulp.dest(options.root)))
		);
	});

	cleanSeries.push(() => del([sergeComponent.source_dir + buildDirectory  + '/lang']));

});

gulp.task('clean', gulp.series(cleanSeries));
gulp.task('build', gulp.series(buildSeries));
