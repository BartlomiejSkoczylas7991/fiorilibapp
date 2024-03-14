sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var Tar_Map = BlockBase.extend("fiorilibappname.SharedBlocks.technicalInformation.Tar_Map", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Tar_Map",
					type: "XML"
				},
				Expanded: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Tar_Map",
					type: "XML"
				}
			}
		}
	});

	return Tar_Map;
});
