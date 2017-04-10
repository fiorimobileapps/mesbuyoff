sap.ui.define([], function() {
	"use strict";

	return {
		_defaultDateTime: new Date(new Date().setHours(11, 0, 0, 0)),

		initDateTime: function(value) {
			if (!value) {
				return "";
			}

			var hours, minutes, seconds;
			hours = value.substring(2, 4) * 1;
			minutes = value.substring(5, 7) * 1;
			seconds = value.substring(8, 10) * 1;

			var oDate = new Date();
			oDate.setHours(hours, minutes, seconds, 0);
			return oDate;
		},

		formatTime: function(value) {
			if (!value) {
				return "";
			}
			
			var oDate = this.initDateTime(value);
			var _defaultDateTime = this._defaultDateTime;

			var str = "";
			var diff = [];

			if (_defaultDateTime >= oDate) {
				diff = this.getTimeDiff(_defaultDateTime, oDate);
				if (diff[0] >= 1) {
					return diff[0] === 1 ? "1 week ago" : diff[0] + " weeks ago";
				} else {
					if (diff[1] >= 1) {
						return diff[1] === 1 ? "1 day ago" : diff[1] + " days ago";
					} else {
						if (diff[2] >= 1) {
							if (diff[3] === 0) {
								return diff[2] === 1 ? "1 hr ago" : diff[2] + " hrs ago";
							} else {
								if (diff[2] > 0) {
									str += diff[2] === 1 ? "1 hr " : diff[2] + " hrs ";
								}
								if (diff[3] === 1) {
									str = str + " 1 min ago";
								} else {
									str = str + diff[3] + " mins ago";
								}
								return str;
							}
						} else {
							return diff[3] === 1 ? "1 min ago" : diff[3] + " mins ago";
						}
					}
				}

			} else {
				str = " ";
				diff = this.getTimeDiff(oDate, _defaultDateTime);
				if (diff[0] >= 1) {
					return diff[0] === 1 ? " 1 week" : " " + diff[0] + " weeks";
				} else {
					if (diff[1] >= 1) {
						return diff[1] === 1 ? +" 1 day" : " " + diff[1] + " days";
					} else {
						if (diff[2] >= 1) {
							if (diff[3] === 0) {
								return diff[2] === 1 ? " 1 hr " : " " + diff[2] + " hrs ";
							} else {
								if (diff[2] > 0) {
									str += diff[2] === 1 ? "1 hr " : diff[2] + " hrs ";
								}
								if (diff[3] === 1) {
									str = str + " 1 min";
								} else {
									str = str + diff[3] + " mins";
								}
								return str;
							}
						} else {
							return diff[3] === 1 ? " 1 min" : " " + diff[3] + " mins";
						}
					}
				}
			}
		},

		getTimeDiff: function(date2, date) {
			var duration, totalmi, ws, ds, hr, mi = 0;
			duration = date2.getTime() - date.getTime();
			totalmi = duration / 60000;

			hr = Math.floor(totalmi / 60);
			mi = Math.floor(totalmi % 60);
			ds = Math.floor(hr / 24);
			ws = Math.floor(ds / 7);
			return [ws, ds, hr, mi];
		},

		formatTimeColor: function(value) {
			var oDate = this.initDateTime(value);
			var _defaultDateTime = this._defaultDateTime;

			var diff = [];
			if (_defaultDateTime >= oDate) {
				diff = this.getTimeDiff(_defaultDateTime, oDate);
			} else {
				diff = this.getTimeDiff(oDate, _defaultDateTime);
			}

			if (diff[0] === 0 && diff[1] === 0 && diff[2] === 0 && diff[3] <= 30) {
				return "Error";
			}
			return "None";
		},

		formatTimeColor2: function(value) {
			if (value < 30) {
				return "Error";
			}
			return "None";
		}
	};
});