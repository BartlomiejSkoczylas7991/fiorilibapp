sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var Role = BlockBase.extend("fiorilibappname.SharedBlocks.technicalInformation.Role", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Role",
					type: "XML"
				},
				Expanded: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Role",
					type: "XML"
				}
			}
		}
	});

	return Role;
});
