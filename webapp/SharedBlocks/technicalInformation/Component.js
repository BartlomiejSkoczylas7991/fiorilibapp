sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var Component = BlockBase.extend("fiorilibappname.SharedBlocks.technicalInformation.Component", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Component",
					type: "XML"
				},
				Expanded: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Component",
					type: "XML"
				}
			}
		}
	});

	return Component;
});
