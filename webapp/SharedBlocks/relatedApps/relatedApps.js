sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var relatedApps = BlockBase.extend("fiorilibappname.SharedBlocks.relatedApps.relatedApps", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "fiorilibappname.SharedBlocks.relatedApps.relatedApps",
					type: "XML"
				},
				Expanded: {
					viewName: "fiorilibappname.SharedBlocks.relatedApps.relatedApps",
					type: "XML"
				}
			}
		}
	});

	return relatedApps;
});
