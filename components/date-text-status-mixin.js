'use strict';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import './localize-behavior.js';

/**
 * @polymerMixin
 */
export const interalDateTextAndStatusMixin = function(superClass) {
	return class extends mixinBehaviors([
		D2L.PolymerBehaviors.Enrollment.LocalizeBehavior
	], superClass) {
		dateTextAndStatus(isCompletionDate, date) {
			if (!date || typeof isCompletionDate !== 'boolean') {
				return null;
			}

			var msInDay = 86400000;
			var msInAWeek = 604800000;
			var nowDate = new Date(Date.now());
			nowDate.setHours(0, 0, 0, 0);

			var tomorrowDate = new Date(Date.now() + msInDay);
			tomorrowDate.setHours(0, 0, 0, 0);

			var yesterdayDate = new Date(Date.now() - msInDay);
			yesterdayDate.setHours(0, 0, 0, 0);

			var pastWeekFromNow = new Date(Date.now() - msInAWeek);
			pastWeekFromNow.setHours(0, 0, 0, 0);

			var parsedDate = new Date(Date.parse(date));
			var dateTypeText = isCompletionDate ? 'completed' : 'due';

			var dateText;
			if (this._compareDate(parsedDate, nowDate)) {
				dateText = this.localize(dateTypeText + 'Today');
			} else if (this._compareDate(parsedDate, tomorrowDate)) {
				dateText = this.localize(dateTypeText + 'Tomorrow');
			} else if (this._compareDate(parsedDate, yesterdayDate)) {
				dateText = this.localize(dateTypeText + 'Yesterday');
			} else if (parsedDate >= pastWeekFromNow && parsedDate <= nowDate) {
				var daysAgo = Math.ceil((nowDate - parsedDate) / msInDay);
				dateText = this.localize(dateTypeText + 'DaysAgo', 'number', daysAgo.toString());
			} else {
				dateText = this.localize(dateTypeText + 'On', 'dateTime', this.formatDate(parsedDate, {format: this._dateFormat(parsedDate, nowDate)}));
			}

			var status = null;
			if (isCompletionDate && parsedDate < tomorrowDate) {
				status = 'completed';
			} else if (parsedDate < nowDate) {
				status = 'overdue';
			}

			var dateTextAndStatus = {
				dateText: dateText,
				status: status
			};
			return dateTextAndStatus;
		}

		_dateFormat(date, nowDate) {
			var msInAWeek = 604800000;
			var weekFromNow = new Date(Date.now() + msInAWeek);
			weekFromNow.setHours(0, 0, 0, 0);

			if (date < weekFromNow && date > nowDate) {
				return 'dddd';
			} else if (date.getFullYear() === nowDate.getFullYear()) {
				return 'MMM d';
			}

			return 'MMM d, yyyy';
		}

		_compareDate(dateOne, dateTwo) {
			return dateOne.getFullYear() === dateTwo.getFullYear() &&
				dateOne.getMonth() === dateTwo.getMonth() &&
				dateOne.getDate() === dateTwo.getDate();
		}
	};
};

export const DateTextAndStatusMixin = dedupingMixin(interalDateTextAndStatusMixin);