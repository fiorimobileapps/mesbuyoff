/* hybrid capacity bootstrap
 * 
 * This has to be happened after sapui5 bootstrap, and before first application page is loaded 
 */

sap.HybridApp = {
	IsFioriMobile: false,
	Landscape:"hanatrial.ondemand.com",
	Account:"p1234567890trial",

	init: function() {
		$.getJSON(jQuery.sap.getModulePath("mes.buyoff") + "/Config.json", function(json) {
			sap.HybridApp.Landscape = json.Landscape;
			sap.HybridApp.Account = json.Account;
		});
		
		if ((sap.ui.Device.system.phone || sap.ui.Device.system.tablet) && !sap.ui.Device.system.desktop) {
			sap.HybridApp.IsFioriMobile = !(this.hasAppContext());
		}

		jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("mes.buyoff.css.sapMES", ".css"));
	},

	resolveUrl: function(url, protocol) {
		var str = "/destinations";
		var adjustedUrl = url.substring(str.length);
		var destination = adjustedUrl.substring(1, adjustedUrl.indexOf("/", 1));
		return protocol + "://" + destination + this.Account + "." + this.Landscape + adjustedUrl;
	}
};