sap.ui.define([
	"mes/buyoff/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("mes.buyoff.controller.NotFound", {

		/**
		 * Navigates to the worklist when the link is pressed
		 * @public
		 */
		onLinkPressed: function() {
			this.getRouter().navTo("overview");
		}

	});

});