sap.ui.define([
	"mes/buyoff/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"mes/buyoff/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/routing/History",
	"sap/ui/core/format/DateFormat",
	"mes/buyoff/util/PermissionHelper",
	"mes/buyoff/util/AppContextHelper",
	"mes/buyoff/util/URLHelper"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, History, DateFormat, PermissionHelper, AppContextHelper,
	URLHelper) {
	"use strict";

	return BaseController.extend("mes.buyoff.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function() {
			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(this.onBeforeShow, this),
				onAfterShow: jQuery.proxy(this.onAfterShow, this)
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		onBeforeShow: function(oEvent) {
			if (oEvent.direction === "to") {
				this._setEditFeedbackMode(false);
			}
		},

		onAfterShow: function(oEvent) {
			if (oEvent.direction === "to" || oEvent.direction === "initial") {
				if (navigator.camera) {
					navigator.camera.cleanup();
				}
			}
		},

		handleRejectPress: function() {
			var iconTabBar = this.getView().byId("itb1");
			iconTabBar.setSelectedKey("feedback");

			this._setEditFeedbackMode(true);
		},

		handleCancelPress: function() {
			this._setEditFeedbackMode(false);

			var oDetailModel = this.getModel("detail");
			oDetailModel.getData().Items = [];
			oDetailModel.refresh(true);
		},

		handleSavePress: function() {
			var oDetailModel = this.getModel("detail");
			var items = oDetailModel.getData().Items;

			var SFI = this.getView().byId("SFI").getText();
			var reasonCode = this.getView().byId("reasonCode").getSelectedKey();
			var note = this.getView().byId("note").getValue();
			oDetailModel.setProperty("/QualityIssueSFI", SFI);
			oDetailModel.setProperty("/QualityIssueReasonCode", reasonCode);
			oDetailModel.setProperty("/QualityIssueNote", note);

			// Fileupload not supported
			this._issueUploadSuccess();
		},

		handleConfirmPress: function() {
			var oResourceBundle = this.getResourceBundle();
			sap.m.MessageToast.show(oResourceBundle.getText("confirmed"));

			var oDetailModel = this.getModel("detail");
			oDetailModel.setProperty("/Status", "Confirmed");

			this.onNavBack();
		},

		handleContactPress: function(oEvent) {
			var oLink = oEvent.getSource();

			// create menu only once
			if (!this._contactMenu) {
				this._contactMenu = sap.ui.xmlfragment(
					"mes.buyoff.fragments.ContactMenu",
					this
				);
				this.getView().addDependent(this._contactMenu);
			}

			this._contactMenu.openBy(oLink);
		},

		handlePhoneCall: function() {
			var oDetailModel = this.getModel("detail");
			sap.m.URLHelper.triggerTel(oDetailModel.getProperty("/PhoneNumber"));
		},

		handleSMSMessage: function() {
			var oDetailModel = this.getModel("detail");
			var phoneNumber = oDetailModel.getProperty("/PhoneNumber");
			// You need to use Sms Cordova Plugin if you want to show message
			//var oResourceBundle = this.getResourceBundle();
			//var message = oResourceBundle.getText("shareSendSmsMessage");
			sap.m.URLHelper.triggerSms(phoneNumber);
		},

		handleAttachmentPress: function(oEvent) {
			var oLink = oEvent.getSource();

			// create menu only once
			if (!this._attachmentMenu) {
				this._attachmentMenu = sap.ui.xmlfragment(
					"mes.buyoff.fragments.AttachmentMenu",
					this
				);
				this.getView().addDependent(this._attachmentMenu);
			}

			this._attachmentMenu.openBy(oLink);
		},

		handleAttachImage: function() {
			PermissionHelper.hasPermission("CAMERA",
				jQuery.proxy(this._hasCameraPermission, this),
				PermissionHelper.requestPermissionError);
		},

		handleAttachAudio: function() {
			PermissionHelper.hasPermission("RECORD_AUDIO",
				jQuery.proxy(this._hasMicrophonePermission, this),
				PermissionHelper.requestPermissionError);
		},

		onFileDeleted: function(oEvent) {
			var itemToDeleteId = oEvent.getParameter("documentId");
			var items = this.getModel("detail").getData().Items;
			jQuery.each(items, function(index) {
				if (items[index] && items[index].DocumentId === itemToDeleteId) {
					items.splice(index, 1);
				}
			});
			this.getModel("detail").refresh(false);
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		_hasCameraPermission: function(oEvent) {
			if (oEvent.hasPermission) {
				if (window.cordova && navigator.camera) {
					navigator.camera.getPicture(
						jQuery.proxy(this._getPictureSuccess, this),
						this._getPictureError, {
							targetWidth: 600,
							targetHeight: 600,
							quality: 50,
							destinationType: navigator.camera.DestinationType.FILE_URL,
							correctOrientation: true
						}
					);
				}
			} else {
				PermissionHelper.requestPermission("CAMERA",
					jQuery.proxy(this._requestCameraPermission, this),
					PermissionHelper.requestPermissionError);
			}
		},

		_requestCameraPermission: function(oEvent) {
			if (oEvent.hasPermission) {
				this._hasCameraPermission(oEvent);
			} else {
				jQuery.sap.log.error("Request permission rejected");
			}
		},

		_getPictureSuccess: function(imageUrl) {
			var fileName = this._generateFileName("jpg");
			var oDetailModel = this.getModel("detail");
			var data = oDetailModel.getData();

			var obj = {
				"DocumentId": fileName,
				"FileName": fileName,
				"MimeType": "image/jpeg",
				"Url": imageUrl,
				"Attributes": [{
					"Title": AppContextHelper.getUserId(),
					"Text": this._formatDateTime(new Date())
				}]
			};
			data.Items.push(obj);
			oDetailModel.refresh(true);
		},

		_getPictureError: function(oEvent) {
			jQuery.sap.log.error("Get picture Error code: " + oEvent.code);
		},

		_hasMicrophonePermission: function(oEvent) {
			if (oEvent.hasPermission) {
				if (navigator.device && navigator.device.capture) {
					var options = {
						limit: 1,
						duration: 10
					};

					navigator.device.capture.captureAudio(
						jQuery.proxy(this._captureAudioSuccess, this),
						jQuery.proxy(this._captureAudioError, this),
						options);
				}
			} else {
				PermissionHelper.requestPermissions(["RECORD_AUDIO", "WRITE_EXTERNAL_STORAGE"],
					jQuery.proxy(this._requestMicrophonePermission, this),
					PermissionHelper.requestPermissionError);
			}
		},

		_requestMicrophonePermission: function(oEvent) {
			if (oEvent.hasPermission) {
				this._hasMicrophonePermission(oEvent);
			} else {
				jQuery.sap.log.error("Request permission rejected");
			}
		},

		_captureAudioError: function(oEvent) {
			jQuery.sap.log.error("Capture audio Error code: " + oEvent.code);
		},

		_captureAudioSuccess: function(oEvent) {
			var i, path, len;

			var oDetailModel = this.getModel("detail");
			var data = oDetailModel.getData();

			for (i = 0, len = oEvent.length; i < len; i += 1) {
				path = oEvent[i].fullPath;
				var fileType = path.substr(path.lastIndexOf(".") + 1);
				var fileName = this._generateFileName(fileType);
				var type = fileType === "wav" ? "audio/wav" : "audio/x-m4a";
				var obj = {
					"DocumentId": fileName,
					"FileName": fileName,
					"MimeType": type,
					"Url": path,
					"Attributes": [{
						"Title": AppContextHelper.getUserId(),
						"Text": this._formatDateTime(new Date())
					}]
				};
				data.Items.push(obj);
				oDetailModel.refresh(true);
			}
		},

		_writeFileSuccess: function(fs) {
			var fileName = this._generateFileName("jpg");
			this._nativeImageUrl = fs.nativeURL + fileName;

			var that = this;
			fs.getFile(fileName, {
				create: true
			}, function(fileEntry) {
				fileEntry.createWriter(function(fileWriter) {
					fileWriter.onwriteend = jQuery.proxy(that._writeEndSuccess, that);
				});
			});
		},

		_writeEndSuccess: function(oEvent) {
			var imageUrl = this._nativeImageUrl; //oEvent.target.localURL;
			var fileName = imageUrl.substr(imageUrl.lastIndexOf("/") + 1);
			var oDetailModel = this.getModel("detail");
			var data = oDetailModel.getData();
			var obj = {
				"DocumentId": fileName,
				"FileName": fileName,
				"MimeType": "image/jpeg",
				"Url": imageUrl,
				"Attributes": [{
					"Title": AppContextHelper.getUserId(),
					"Text": this._formatDateTime(new Date())
				}]
			};
			data.Items.push(obj);
			oDetailModel.refresh(true);
		},

		_generateFileName: function(fileType) {
			return AppContextHelper.getUserId() + "-" + new Date().valueOf() + "." + fileType;
		},

		_b64toBlob: function(b64Data, contentType) {
			var sliceSize = 512;
			var byteCharacters = atob(b64Data);
			var byteArrays = [];
			for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
				var slice = byteCharacters.slice(offset, offset + sliceSize);
				var byteNumbers = new Array(slice.length);
				for (var i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}
				var byteArray = new Uint8Array(byteNumbers);
				byteArrays.push(byteArray);
			}

			var blob = new Blob(byteArrays, {
				type: contentType
			});
			return blob;
		},

		_issueUploadSuccess: function(oEvent) {
			sap.ui.core.BusyIndicator.hide();

			var oResourceBundle = this.getResourceBundle();
			sap.m.MessageToast.show(oResourceBundle.getText("rejected"));

			var oDetailModel = this.getModel("detail");
			oDetailModel.setProperty("/Status", "Rejected");

			this.onNavBack();
		},

		// set enable or disable input controls for hide iOS keyboard due to focus issues 
		_enableInputControls: function(bEnabled) {
			this.getView().byId("note").setEnabled(bEnabled);
		},

		_formatDateTime: function(value) {
			if (!value) {
				return "";
			}

			var oDisplayDateFormat = DateFormat.getDateInstance({
				pattern: "yyyy-mm-dd"
			});

			var oTimeFormat = DateFormat.getTimeInstance({
				pattern: "HH:mm"
			});
			return oDisplayDateFormat.format(value) + " " + oTimeFormat.format(value);
		},

		_setEditFeedbackMode: function(flag) {
			var displayFeedBack = this.getView().byId("displayFeedBack");
			displayFeedBack.setVisible(!flag);

			var editFeedBack = this.getView().byId("editFeedBack");
			editFeedBack.setVisible(flag);

			var oDetailModel = this.getModel("detail");
			this.getView().byId("note").setValue(oDetailModel.getProperty("/QualityIssueNote"));

			var attachmentIcon = this.getView().byId("attachmentIcon");
			attachmentIcon.setVisible(flag);

			var cancelButton = this.getView().byId("cancel");
			cancelButton.setVisible(flag);

			var saveButton = this.getView().byId("save");
			saveButton.setVisible(flag);

			var confirmButton = this.getView().byId("confirm");
			confirmButton.setVisible(!flag);

			var rejectButton = this.getView().byId("reject");
			rejectButton.setVisible(!flag);
		}
	});
});