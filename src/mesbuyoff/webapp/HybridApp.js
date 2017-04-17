/* hybrid capacity bootstrap
 * 
 * This has to be happened after sapui5 bootstrap, and before first application page is loaded 
 */

sap.HybridApp = {
	IsFioriMobile: false,
	Landscape:"hanatrial.ondemand.com",
	Account:"p1234567890trial",
	User: {
		Id: "P1234567890",
		FullName: "",
		Email: ""
	},

	init: function() {
		$.getJSON(jQuery.sap.getModulePath("mes.buyoff") + "/Config.json", function(json) {
			sap.HybridApp.Landscape = json.Landscape;
			sap.HybridApp.Account = json.Account;
		});
		
		if ((sap.ui.Device.system.phone || sap.ui.Device.system.tablet) && !sap.ui.Device.system.desktop) {
			sap.HybridApp.IsFioriMobile = !(this.hasAppContext());
		}

		jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("mes.buyoff.css.sapMES", ".css"));
	
		this.getUserId();
	},

	getUserId: function() {
		if (sap.HybridApp.IsFioriMobile) {
			// Get user info from kapsel function & HCPms API
			var that = this;
			var onSuccess = function(result) {
				var serverInfo = result.registrationContext.serverHost.replace("dispatcher.", ""); 
				var sap.HybridApp.Account = serverInfo.substring(serverInfo.indexOf("-") + 1, serverInfo.indexOf("."));
				var sap.HybridApp.Landscape = serverInfo.substring(serverInfo.indexOf(".") + 1);

				var baseURL = "https://" + result.registrationContext.serverHost + ":" + result.registrationContext.serverPort + "/mobileservices";
				var appId = result.applicationEndpointURL.substring(result.applicationEndpointURL.indexOf(result.registrationContext.resourcePath) +
					result.registrationContext.resourcePath.toString().length + 1);
				var url = baseURL + "/odata/applications/latest/" + appId + "/Connections('" + result.applicationConnectionId + "')";
				var headers = {
					"X-SMP-APPCID": result.applicationConnectionId
				};

				jQuery.ajax({
					url: url,
					async: true,
					headers: headers,
					cache: false,
					dataType: "json",
					success: function(data, textStatus, xhr) {
						var user = data.d.UserName;
						sap.HybridApp.User.Id = user.charAt(0).toUpperCase() + user.slice(1);
					},
					error: function(xhr, textStatus, e) {
						jQuery.sap.log.error("Error - " + JSON.stringify(e));
					}
				});
			};
			var onError = function(error) {
				jQuery.sap.log.error("Error - " + JSON.stringify(error));
			};
			sap.Logon.core.getContext(onSuccess, onError);
		} else {
			if (this.hasAppContext()) {
				var serverInfo = sap.hybrid.SMP.AppContext.registrationContext.serverHost; 
				var sap.HybridApp.Account = serverInfo.substring(serverInfo.indexOf("-") + 1, serverInfo.indexOf("."));
				var sap.HybridApp.Landscape = serverInfo.substring(serverInfo.indexOf(".") + 1);

				var user = sap.hybrid.SMP.AppContext.registrationContext.user;
				sap.HybridApp.User.Id = user.charAt(0).toUpperCase() + user.slice(1);
			}
		}
	},

	hasAppContext: function() {
		return sap.hybrid && sap.hybrid.SMP && sap.hybrid.SMP.AppContext;
	},

	resolveUrl: function(url, protocol) {
		var str = "/destinations";
		var adjustedUrl = url.substring(str.length);
		var destination = adjustedUrl.substring(1, adjustedUrl.indexOf("/", 1));
		return protocol + "://" + destination + this.Account + "." + this.Landscape + adjustedUrl;
	}
};