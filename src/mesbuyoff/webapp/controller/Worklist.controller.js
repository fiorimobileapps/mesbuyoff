sap.ui.define([
	"mes/buyoff/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"mes/buyoff/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/routing/History",
	"mes/buyoff/util/AppContextHelper"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, History, AppContextHelper) {
	"use strict";

	return BaseController.extend("mes.buyoff.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			this._mFilters = {
				"rejected": [new sap.ui.model.Filter("Status", "EQ", "Rejected")],
				"waiting": [new sap.ui.model.Filter("Status", "EQ", "Waiting")],
				"confirmed": [new sap.ui.model.Filter("Status", "EQ", "Confirmed")]
			};
			var oViewModel = new JSONModel({
				rejected: 0,
				waiting: 0,
				confirmed: 0,
				_selectedTab: "waiting"
			});
			this.setModel(oViewModel, "viewModel");
			this.getView().addEventDelegate({
				onAfterShow: jQuery.proxy(this.onAfterShow, this)
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		onAfterShow: function(oEvent) {
			var oBinding = this.getView().byId("list").getBinding("items");
			var iconTab = this.getView().byId("idIconTabBar");
			var sKey = iconTab.getSelectedKey();
			if (sKey) {
				oBinding.filter(this._mFilters[sKey]);
			} else {
				oBinding.filter(this._mFilters["waiting"]);
			}
		},

		handleSelectionChange: function(oEvent) {
			var list = this.getView().byId("list");
			var item = list.getSelectedItem();

			var oModel = this.getModel();
			var oData = oModel.getProperty(item.getBindingContext().getPath());
			if (!oData.Items) {
				oData.Items = [];
			}

			var oDetailModel = this.getModel("detail");
			oDetailModel.setData(oData);

			// We want to select same item again 
			list.removeSelections(true);

			this.getRouter().navTo("detail");
		},

		getOperation: function(oContext) {
			return "WorkCenter:" + oContext.getProperty("WorkCenter");
		},

		onUpdateFinished: function(oEvent) {
			var list = this.getView().byId("list");
			if (list.getBinding("items").isLengthFinal()) {
				var oViewModel = this.getModel("viewModel");
				var oModel = this.getModel();
				var tasks = oModel.getObject("/Task");

				if (tasks) { // JSON Data
					var rejected = 0,
						waiting = 0,
						confirmed = 0;
	
					for (var i = 0; i < tasks.length; i++) {
	
						if (tasks[i].Status === "Rejected") {
							rejected++;
						}
						if (tasks[i].Status === "Waiting") {
							waiting++;
						}
						if (tasks[i].Status === "Confirmed") {
							confirmed++;
						}
					}
					oViewModel.setProperty("/rejected", rejected);
					oViewModel.setProperty("/waiting", waiting);
					oViewModel.setProperty("/confirmed", confirmed);
				}
				else { // oData or Mock Data
					oModel.read("/Task/$count", {
						success: function (oData) {
							oViewModel.setProperty("/rejected", oData);
						},
						filters: this._mFilters.rejected
					});
	
					oModel.read("/Task/$count", {
						success: function(oData){
							oViewModel.setProperty("/waiting", oData);
						},
						filters: this._mFilters.waiting
					});
	
					oModel.read("/Task/$count", {
						success: function(oData){
							oViewModel.setProperty("/confirmed", oData);
						},
						filters: this._mFilters.confirmed
					});
				}
			}
		},

		onQuickFilter: function(oEvent) {
			var oBinding = this.getView().byId("list").getBinding("items"),
				sKey = oEvent.getParameter("selectedKey");

			var oViewModel = this.getModel("viewModel");
			oViewModel.setProperty("/_selectedTab", sKey);

			oBinding.filter(this._mFilters[sKey]);

		}
	});
});