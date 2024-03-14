sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var Description = BlockBase.extend("fiorilibappname.SharedBlocks.businessDescription.Description", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "fiorilibappname.SharedBlocks.businessDescription.Description",
					type: "XML"
				},
				Expanded: {
					viewName: "fiorilibappname.SharedBlocks.businessDescription.Description",
					type: "XML"
				}
			}
		}
	});

	return Description;
});
