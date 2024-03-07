sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var BlockEmpDetailPart2 = BlockBase.extend("sap.uxap.sample.SharedBlocks.employment.BlockEmpDetailPart2", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "fiorilibappname.SharedBlocks.importantNotes.Comments",
					type: "XML"
				},
				Expanded: {
					viewName: "fiorilibappname.SharedBlocks.importantNotes.Comments",
					type: "XML"
				}
			}
		}
	});

	return BlockEmpDetailPart2;
});
