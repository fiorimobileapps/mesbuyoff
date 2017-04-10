sap.ui.define(["jquery.sap.global", "sap/m/UploadCollection", "mes/buyoff/util/URLHelper"],
	function(jQuery, UploadCollection, URLHelper) {
		"use strict";

		var CustomUploadCollection = UploadCollection.extend("mes.buyoff.controls.UploadCollection", {
			metadata: {}
		});

		CustomUploadCollection.prototype._createIcon = function(oItem, sItemId, sFileNameLong, that) {
			var sThumbnailUrl, sThumbnail, oItemIcon;

			sThumbnailUrl = oItem.getThumbnailUrl();
			if (sThumbnailUrl) {
				oItemIcon = new sap.m.Image(sItemId + "-ia_imageHL", {
					src: CustomUploadCollection.prototype._getThumbnail(sThumbnailUrl, sFileNameLong),
					decorative: false,
					alt: this._getAriaLabelForPicture(oItem)
				}).addStyleClass("sapMUCItemImage");
			} else {
				sThumbnail = CustomUploadCollection.prototype._getThumbnail(undefined, sFileNameLong);
				var sStyleClass;
				oItemIcon = new sap.ui.core.Icon(sItemId + "-ia_iconHL", {
					src: sThumbnail,
					decorative: false,
					useIconTooltip: false,
					alt: this._getAriaLabelForPicture(oItem)
				});
				//Sets the right style class depending on the icon/placeholder status (clickable or not)
				if (this.sErrorState !== "Error" && jQuery.trim(oItem.getProperty("url"))) {
					sStyleClass = "sapMUCItemIcon";
				} else {
					sStyleClass = "sapMUCItemIconInactive";
				}
				// Fixed the Inactive Camera Icon issue in Fiori Mobile build
				/*if (sThumbnail === UploadCollection._placeholderCamera) {
					if (this.sErrorState !== "Error" && jQuery.trim(oItem.getProperty("url"))) {
						sStyleClass = sStyleClass + " sapMUCItemPlaceholder";
					} else {
						sStyleClass = sStyleClass + " sapMUCItemPlaceholderInactive";
					}
				}*/
				oItemIcon.addStyleClass(sStyleClass);
			}
			if (this.sErrorState !== "Error" && jQuery.trim(oItem.getProperty("url"))) {
				oItemIcon.attachPress(function(oEvent) {
					CustomUploadCollection.prototype._triggerLink(oEvent, that);
				});
			}
			return oItemIcon;
		};

		CustomUploadCollection.prototype._getIconFromFilename = function(sFilename) {
			var sFileExtension = this._splitFilename(sFilename).extension;
			if (jQuery.type(sFileExtension) === "string") {
				sFileExtension = sFileExtension.toLowerCase();
			}

			switch (sFileExtension) {
				case ".wav":
				case ".m4a":
					return "sap-icon://attachment-audio";
				default:
					return UploadCollection.prototype._getIconFromFilename.apply(this, arguments);
			}
		};

		CustomUploadCollection.prototype._triggerLink = function(oEvent, oContext) {
			var iLine = null;
			var aId;

			if (oContext.editModeItem) {
				//In case there is a list item in edit mode, the edit mode has to be finished first.
				sap.m.UploadCollection.prototype._handleOk(oEvent, oContext, oContext.editModeItem, true);
				if (oContext.sErrorState === "Error") {
					//If there is an error, the link of the list item must not be triggered.
					return this;
				}
				oContext.sFocusId = oEvent.getParameter("id");
			}
			aId = oEvent.oSource.getId().split("-");
			iLine = aId[aId.length - 2];

			//sap.m.URLHelper.redirect(oContext.aItems[iLine].getProperty("url"), true);
			var oItem = oContext.aItems[iLine];
			URLHelper.triggerLink(oEvent, oContext, oItem);
		};

		CustomUploadCollection.prototype._handleENTER = function(oEvent, oContext) {
			var sTarget;
			var sLinkId;
			var oLink;
			if (oContext.editModeItem) {
				sTarget = oEvent.target.id.split(oContext.editModeItem).pop();
			} else {
				sTarget = oEvent.target.id.split("-").pop();
			}

			switch (sTarget) {
				case "-ta_editFileName-inner":
				case "-okButton":
					sap.m.UploadCollection.prototype._handleOk(oEvent, oContext, oContext.editModeItem, true);
					break;
				case "-cancelButton":
					oEvent.preventDefault();
					sap.m.UploadCollection.prototype._handleCancel(oEvent, oContext, oContext.editModeItem);
					break;
				case "-ia_iconHL":
				case "-ia_imageHL":
					//Edit mode
					var iLine = oContext.editModeItem.split("-").pop();
					//sap.m.URLHelper.redirect(oContext.aItems[iLine].getProperty("url"), true);
					break;
				case "ia_iconHL":
				case "ia_imageHL":
				case "cli":
					//Display mode
					sLinkId = oEvent.target.id.split(sTarget)[0] + "ta_filenameHL";
					oLink = sap.ui.getCore().byId(sLinkId);
					if (oLink.getEnabled()) {
						iLine = oEvent.target.id.split("-")[2];
						//sap.m.URLHelper.redirect(oContext.aItems[iLine].getProperty("url"), true);
					}
					break;
				default:
					return;
			}
		};

		return CustomUploadCollection;

	}, /* bExport= */ true);