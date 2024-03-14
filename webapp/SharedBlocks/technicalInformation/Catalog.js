sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var Catalog = BlockBase.extend("fiorilibappname.SharedBlocks.technicalInformation.Catalog", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Catalog",
					type: "XML"
				},
				Expanded: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Catalog",
					type: "XML"
				}
			}
		}
	});

	return Catalog;
});
