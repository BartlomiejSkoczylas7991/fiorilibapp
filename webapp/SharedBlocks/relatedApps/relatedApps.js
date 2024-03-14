sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var relatedApps = BlockBase.extend("fiorilibappname.SharedBlocks.technicalInformation.relatedApps", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.relatedApps",
					type: "XML"
				},
				Expanded: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.relatedApps",
					type: "XML"
				}
			}
		}
	});

	return relatedApps;
});
