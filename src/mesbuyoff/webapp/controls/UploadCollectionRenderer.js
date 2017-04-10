sap.ui.define(["jquery.sap.global", "sap/ui/core/Renderer", "sap/m/UploadCollectionRenderer"],
	function(jQuery, Renderer, UploadCollectionRenderer) {
		"use strict";

		var CustomUploadCollectionRenderer = Renderer.extend(UploadCollectionRenderer);

		return CustomUploadCollectionRenderer;

	}, /* bExport= */ true);