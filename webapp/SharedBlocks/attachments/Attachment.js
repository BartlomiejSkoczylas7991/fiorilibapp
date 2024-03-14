sap.ui.define(['sap/uxap/BlockBase'], function (BlockBase) {
	"use strict";

	var Attachment = BlockBase.extend("fiorilibappname.SharedBlocks.technicalInformation.Attachment", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Attachment",
					type: "XML"
				},
				Expanded: {
					viewName: "fiorilibappname.SharedBlocks.technicalInformation.Attachment",
					type: "XML"
				}
			}
		}
	});

	return Attachment;
});
