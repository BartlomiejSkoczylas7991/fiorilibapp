sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var BlockEmpDetailPart2 = BlockBase.extend("sap.uxap.sample.SharedBlocks.employment.BlockEmpDetailPart2", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "fiorilibappname.SharedBlocks.businessDescription.Image",
					type: "XML"
				},
				Expanded: {
					viewName: "fiorilibappname.SharedBlocks.businessDescription.Image",
					type: "XML"
				}
			}
		}
	});

	return BlockEmpDetailPart2;
});
