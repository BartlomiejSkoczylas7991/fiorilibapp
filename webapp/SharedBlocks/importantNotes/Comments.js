sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var Comments = BlockBase.extend("fiorilibappname.SharedBlocks.importantNotes.Comments", {
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

	return Comments;
});
