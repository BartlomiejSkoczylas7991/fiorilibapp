sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var Group = BlockBase.extend("fiorilibappname.SharedBlocks.technicalInformation.Group", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Group",
					type: "XML"
				},
				Expanded: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Group",
					type: "XML"
				}
			}
		}
	});

	return Group;
});
