sap.ui.define([], function() {
	"use strict";

	return {
		hasAppContext: function() {
			return sap.HybridApp.hasAppContext();
		},

		getAdapterUrl: function(useFullUrl) {
			var url = "";
			if (sap.ui.Device.system.desktop || sap.HybridApp.IsFioriMobile) {
				if (useFullUrl) {
					// This is needed for FileUpload
					url = this.resolveUrl("/destinations/cloudadapters/","https");
				}
				else {
					url = "/destinations/cloudadapters/";
				}
			} else if (this.hasAppContext()) {
				url = sap.hybrid.SMP.AppContext.applicationEndpointURL + ".adapter/";
			}
			return url;
		},

		getHeader: function() {
			var oHeader;
			if (this.hasAppContext()) {
				oHeader = {
					"X-SMP-APPCID": sap.hybrid.SMP.AppContext.applicationConnectionId
				};
			} else {
				oHeader = {};
			}

			return oHeader;
		},

		resolveUrl:function(url, protocol) {
			return sap.HybridApp.resolveUrl(url, protocol);
		},

		getUserId: function() {
			return sap.HybridApp.User.Id;
		}
	};
});