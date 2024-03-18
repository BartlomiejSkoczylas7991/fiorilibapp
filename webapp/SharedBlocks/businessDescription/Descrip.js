sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var Descrip = BlockBase.extend("fiorilibappname.SharedBlocks.businessDescription.Descrip", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "fiorilibappname.SharedBlocks.businessDescription.Descrip",
					type: "XML"
				},
				Expanded: {
					viewName: "fiorilibappname.SharedBlocks.businessDescription.Descrip",
					type: "XML"
				}
			}
		}
	});

	return Descrip;
});
