sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";

	return {
		triggerTel: function(tel) {
			if (window.plugins && window.plugins.CallNumber) {
				window.plugins.CallNumber.callNumber(
					function(result) {
						jQuery.sap.log.info("Success:" + result);
					},
					function(e) {
						jQuery.sap.log.info("Error:" + e);
					},
					tel,
					false);
			}
		},

		triggerSms: function(tel, message) {
			if (window.sms) {
				var options = {
					replaceLineBreaks: false, // true to replace \n by a new line, false by default
					android: {
						intent: "INTENT" // send SMS with the native android SMS messaging
					}
				};
				window.sms.send(tel,
					message,
					options,
					function(result) {
						jQuery.sap.log.info("Success:" + result);
					},
					function(e) {
						jQuery.sap.log.info("Error:" + e);
					}
				);
			}
		},

		triggerLink: function(oEvent, oContext, oItem) {
			var url = oItem.getProperty("url");
			var fileName = oItem.getProperty("fileName");
			var mimeType = oItem.getProperty("mimeType");
			var uiArea = oContext.getUIArea();
			var oSource = oEvent.getSource();

			var oModel = new JSONModel();
			oModel.setData({
				"file": [{
					"url": url,
					"fileName": fileName,
					"mimeType": mimeType
				}]
			});
			sap.ui.getCore().setModel(oModel, "attachment");

			if (mimeType === "image/jpeg") {
				if (!this._oPopover) {
					this._oPopover = sap.ui.xmlfragment("mes.lib.fragments.PicturePopover", this);
					uiArea.addDependent(this._oPopover);
					this._oPopover.bindElement({
						path: "/file/0",
						model: "attachment"
					});
				}

				// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
				jQuery.sap.delayedCall(0, this, function() {
					this._oPopover.openBy(oSource);
				});
			} else if (mimeType === "audio/x-m4a" || mimeType === "audio/wav") {
				if (!this._oPopover2) {
					this._oPopover2 = sap.ui.xmlfragment("mes.lib.fragments.AudioPopover", this);
					uiArea.addDependent(this._oPopover2);
					this._oPopover2.bindElement({
						path: "/file/0",
						model: "attachment"
					});
				}

				// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
				jQuery.sap.delayedCall(0, this, function() {
					this._oPopover2.openBy(oSource);
				});
			}

		}
	};
});