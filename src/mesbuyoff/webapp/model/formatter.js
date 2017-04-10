sap.ui.define([
	"mes/buyoff/util/AppContextHelper",
	"mes/buyoff/util/DateTimeFormatterHelper",
], function(AppContextHelper, DateTimeFormatterHelper) {
	"use strict";

	return {

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		getProfileImageUrl: function(value) {
			return jQuery.sap.getModulePath("mes.buyoff") + "/" + "images/contact.jpg";
		},

		getImageUrl: function(value) {
			return jQuery.sap.getModulePath("mes.buyoff") + "/" + value;
		},

		getVideoUrl: function(value) {
			return jQuery.sap.getModulePath("mes.buyoff") + "/" + value;
		},

		getImageCount: function(oItems) {
			var count = 0,
				len = oItems ? oItems.length : 0;

			for (var i = 0; i < len; i++) {
				if (oItems[i].MimeType === "image/jpeg") {
					count++;
				}
			}
			return count;
		},

		getAudioCount: function(oItems) {
			var count = 0,
				len = oItems ? oItems.length : 0;

			for (var i = 0; i < len; i++) {
				if (oItems[i].MimeType === "audio/wav" || oItems[i].MimeType === "audio/x-m4a") {
					count++;
				}
			}
			return count;
		},

		formatDistance: function(value) {
			return value + " m";
		},

		formatTime: function(value) {
			return DateTimeFormatterHelper.formatTime(value);
		},

		formatTimeColor2: function(value) {
			return DateTimeFormatterHelper.formatTimeColor2(value);
		}
	};

});