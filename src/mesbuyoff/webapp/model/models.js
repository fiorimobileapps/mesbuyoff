sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createFLPModel: function() {
			var fnGetUser = jQuery.sap.getObject("sap.ushell.Container.getUser"),
				bIsShareInJamActive = fnGetUser ? fnGetUser().isJamActive() : false,
				oModel = new JSONModel({
					isShareInJamActive: bIsShareInJamActive
				});
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createJSONModel: function() {
			var oTaskModel = new JSONModel();
			oTaskModel.loadData(jQuery.sap.getModulePath("mes.buyoff") + "/localService/mockdata/Task.json", null, false);
			
			var oModel = new JSONModel();
			var oData = {"Task":oTaskModel.getData()}
			oModel.setData(oData);
			return oModel;
		}
	};
});