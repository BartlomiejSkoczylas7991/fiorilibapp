sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var Service = BlockBase.extend("fiorilibappname.SharedBlocks.technicalInformation.Service", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Service",
					type: "XML"
				},
				Expanded: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Service",
					type: "XML"
				}
			}
		}
	});

	return Service;
});
