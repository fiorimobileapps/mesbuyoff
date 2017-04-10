sap.ui.define([
	"mes/buyoff/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("mes.buyoff.controller.App", {

		onInit: function() {
			/*var oViewModel,
				fnSetAppNotBusy,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy : true,
				delay : 0
			});
			this.setModel(oViewModel, "appView");

			fnSetAppNotBusy = function() {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};

			this.getOwnerComponent().getModel().metadataLoaded().
				then(fnSetAppNotBusy);*/

			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			// Fiori Mobile Build
			if (!sap.HybridApp) {
				jQuery.getScript(jQuery.sap.getModulePath("mes.buyoff") + "/HybridApp.js").done(function() {
					sap.HybridApp.init();
				}).fail(function() {
					jQuery.sap.log.error("failed to load HybridApp.js");
				});
			}
		}
	});

});