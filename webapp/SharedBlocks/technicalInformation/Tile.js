sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var Tile = BlockBase.extend("fiorilibappname.SharedBlocks.technicalInformation.Tile", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Tile",
					type: "XML"
				},
				Expanded: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Tile",
					type: "XML"
				}
			}
		}
	});

	return Tile;
});
