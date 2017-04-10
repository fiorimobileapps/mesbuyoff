//"use strict";
sap.ui.define(["sap/ui/core/Control"],
	function(Control) {
		"use strict";

		var Audio = Control
			.extend("mes.buyoff.controls.Audio", {

				metadata: {
					properties: {
						"width": {
							type: "sap.ui.core.CSSSize",
							defaultValue: "100%"
						},
						"height": {
							type: "sap.ui.core.CSSSize",
							defaultValue: "100%"
						},
						"src": {
							type: "string",
							defaultValue: null
						}
					}
				},

				renderer: function(oRm, oControl) {
					oRm.write("<audio id='" + oControl.getId() + "' src='" + oControl.getSrc() + "' style='width:" + oControl.getWidth() + ";height:" +
						oControl.getHeight() + "' controls ");
					oRm.writeClasses();
					oRm.writeStyles();
					oRm.write("/>");
				}
			});

		return Audio;
	}, /* bExport= */ true);