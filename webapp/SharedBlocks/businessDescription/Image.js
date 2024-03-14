sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var Image = BlockBase.extend("fiorilibappname.SharedBlocks.businessDescription.Image", {
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

	return Image;
});
