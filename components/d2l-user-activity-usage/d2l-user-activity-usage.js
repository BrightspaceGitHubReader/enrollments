/**
`d2l-user-activity-usage`

Polymer-based web component for a organization due and completion dates.

@demo demo/d2l-user-activity-usage/d2l-user-activity-usage-demo.html Organization Updates
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'd2l-fetch/d2l-fetch.js';
import SirenParser from 'siren-parser';
import './localize-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-user-activity-usage">
	<template strip-whitespace="">
		<span hidden$="[[overrideToDefault]]">
			[[_dateText]]
		</span>
		<span hidden$="[[_hideDefaultSlot(_date, overrideToDefault)]]"><slot name="default"></slot></span>
	</template>
	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-user-activity-usage',

	properties: {
		href: {
			type: String,
			observer: '_hrefChange'
		},
		overrideToDefault: {
			type: Boolean,
			value: false
		},

		_date: {
			type: String,
			value: null
		},
		_isCompletionDate: Boolean,
		_dateText: {
			type: String,
			computed: '_computeDateText(_date, _isCompletionDate)'
		}
	},

	behaviors: [
		D2L.PolymerBehaviors.Enrollment.UserActivityUsage.LocalizeBehavior
	],
	_msInDay: 86400000,
	_msInAWeek: 604800000,
	_computeDateText: function(date, isCompletionDate) {
		if (!date || typeof isCompletionDate !== 'boolean') {
			return null;
		}

		var nowDate = new Date(Date.now());
		nowDate.setHours(0, 0, 0, 0);

		var tomorrowDate = new Date(Date.now() + this._msInDay);
		tomorrowDate.setHours(0, 0, 0, 0);

		var yesterdayDate = new Date(Date.now() - this._msInDay);
		yesterdayDate.setHours(0, 0, 0, 0);

		var pastWeekFromNow = new Date(Date.now() - this._msInAWeek);
		pastWeekFromNow.setHours(0, 0, 0, 0);

		date = new Date(Date.parse(date));

		var dateTypeText = isCompletionDate ? 'completed' : 'due';

		var dateText;
		if (this._compareDate(date, nowDate)) {
			dateText = this.localize(dateTypeText + 'Today');
		} else if (this._compareDate(date, tomorrowDate)) {
			dateText = this.localize(dateTypeText + 'Tomorrow');
		} else if (this._compareDate(date, yesterdayDate)) {
			dateText = this.localize(dateTypeText + 'Yesterday');
		} else if (date >= pastWeekFromNow && date <= nowDate) {
			var daysAgo = Math.ceil((nowDate - date) / this._msInDay);
			dateText = this.localize(dateTypeText + 'DaysAgo', 'number', daysAgo.toString());
		} else {
			dateText = this.localize(dateTypeText + 'On', 'dateTime', this.formatDate(date, {format: this._dateFormat(date, nowDate)}));
		}

		this.fire('d2l-user-activity-usage-accessible', dateText);

		if (isCompletionDate && date < tomorrowDate) {
			this.fire('d2l-enrollment-status', {status: 'completed'});
		} else if (date < nowDate) {
			this.fire('d2l-enrollment-status', {status: 'overdue'});
		}

		return dateText;
	},
	_hrefChange: function(href) {
		this._date = null;
		if (!href) {
			return;
		}
		return this._fetchSirenEntity(href)
			.then(function(userActivityUsageEntity) {
				var completionDate = this._sirenClassProperty(userActivityUsageEntity, 'completion');
				var dueDate = this._sirenClassProperty(userActivityUsageEntity, 'due-date');

				this._isCompletionDate = !!completionDate;
				this._date = this._isCompletionDate ? completionDate : dueDate;

				if (!userActivityUsageEntity.hasClass('attended')) {
					this.fire('d2l-enrollment-new');
				}

			}.bind(this));
	},
	_sirenClassProperty: function(entity, sirenClass) {
		if (!entity.hasSubEntityByClass(sirenClass)) {
			return;
		}
		var subEntity = entity.getSubEntityByClass(sirenClass);

		if (subEntity.hasClass('date')) {
			return subEntity.properties ? subEntity.properties.date : null;
		} else if (subEntity.hasClass('duration')) {
			return subEntity.properties ? subEntity.properties.seconds : null;
		} else if (subEntity.hasClass('completion')) {
			return this._sirenClassProperty(subEntity,  'completion-date');
		}
	},
	_dateFormat: function(date, nowDate) {
		var weekFromNow = new Date(Date.now() + this._msInAWeek);
		weekFromNow.setHours(0, 0, 0, 0);

		if (date < weekFromNow && date > nowDate) {
			return 'dddd';
		} else if (date.getFullYear() === nowDate.getFullYear()) {
			return 'MMM d';
		}

		return 'MMM d, yyyy';
	},
	_compareDate: function(dateOne, dateTwo) {
		return dateOne.getFullYear() === dateTwo.getFullYear() &&
			dateOne.getMonth() === dateTwo.getMonth() &&
			dateOne.getDate() === dateTwo.getDate();
	},
	_fetchSirenEntity: function(url) {
		if (!url) {
			return;
		}
		return window.d2lfetch
			.fetch(new Request(url, {
				headers: { Accept: 'application/vnd.siren+json' },
			}))
			.then(function(response) {
				if (response.ok) {
					return response.json();
				}
				return Promise.reject(response.status + ' ' + response.statusText);
			})
			.then(SirenParser);
	},
	_hideDefaultSlot: function(date, overrideToDefault) {
		return date && !overrideToDefault;
	}
});
