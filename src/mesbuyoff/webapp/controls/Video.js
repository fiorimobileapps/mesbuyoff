//"use strict";
sap.ui.define(["sap/ui/core/Control"],
	function(Control) {
		"use strict";

		var Video = Control
			.extend("mes.buyoff.controls.Video", {

				metadata: {
					properties: {
						"width": {
							type: "sap.ui.core.CSSSize",
							group: "Appearance",
							defaultValue: null
						},
						"height": {
							type: "sap.ui.core.CSSSize",
							group: "Appearance",
							defaultValue: null
						},
						"src": {
							type: "sap.ui.core.URI",
							group: "Data",
							defaultValue: null
						}
					}
				},

				onAfterRendering: function() {
					if (!sap.ui.Device.system.desktop) {
						var vid = this.getDomRef();
						vid.muted = true;

						// Workaround method to show initial screen
						vid.play();
						jQuery.sap.delayedCall(500, this, function() {
							vid.pause();
							vid.muted = false;
						});
					}
				},

				renderer: function(oRm, oControl) {
					var videoUrl = oControl.getSrc();
					var imageUrl = videoUrl.substr(0, videoUrl.lastIndexOf(".")) + ".jpg";
					oRm.write("<video id='" + oControl.getId() + "' src='" + videoUrl + "' style='width:" + oControl.getWidth() + ";height:" +
						oControl.getHeight() + " poster='" + imageUrl + "' playsinline controls ");
					oRm.writeClasses();
					oRm.writeStyles();
					oRm.write("/>");
				}
			});

		return Video;
	}, /* bExport= */ true);