sap.ui.define([
    "sap/m/library",
    "fiorilibappname/controller/Object.controller",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Item",
	"sap/ui/model/json/JSONModel",
	"sap/m/upload/Uploader",
	"sap/m/StandardListItem",
	"sap/m/MessageToast"
], function (ObjectController, MobileLibrary, Controller, Item, JSONModel, Uploader, ListItem, MessageToast) {
    "use strict";

    var ListMode = MobileLibrary.ListMode;

    var CustomUploader = Uploader.extend("sap.m.sample.UploadSetCustomUploader.CustomUploader", {
        metadata: {}
    });

    CustomUploader.prototype.uploadItem = function (oitem, aHeaders) {
        var sNewUploadUrl = "../../../upload";
        aHeaders.push(new Item({key: "klucz do wstawienia", text: "Text do wstawienia"}));

        Uploader.prototype.uploadItem.call(this, oItem, aHeaders);
    };

    CustomUploader.prototype.downloadItem = function (oItem, aHeaders, bAskForLocation) {
        var sNewDownloadUrl = oItem.getUrl();
        aHeaders.push(new Item({key: "SomeGetKey", text: "Some text do wstawienia"}));
        this.setDownloadUrl(sNewDownloadUrl);

        Uploader.prototype.downloadItem.call(this, oItem, aHeaders, bAskForLocation);
    };

    return ObjectController.extend("fiorilibappname.controller.Image", {
        onInit: function () {
            ObjectController.prototype.onInit.apply(this, arguments);
            var sPath = sap.ui.require.toUrl("link do zdjęć detailView"),
                oUploadSet = this.byId("UploadSet"),
                oCustomUploader = new CustomUploader();
//
            this.getView().setModel(new JSONModel(sPath));

            oUploadSet.setUploader(oCustomUploader);
            oUploadSet.regusterUploadedEvents(oCustomUploader);

            oCustomUploader.attachUploadStarted(this.onUploadStarted.bind(this));
            oCustomUploader.attachUploadProgressed(this.onUploadProgressed.bind(this));
            oCustomUploader.attachUploadCompleted(this.onUploadCompleted.bind(this));
            oCustomUploader.attachUploadAborted(this.onUploadAborted.bind(this));
//
            oUploadSet.getList().setMode(ListMode.MultiSelect);
        },

        onUploadStarted: function (oEvent) {
            var oList = this.byId("progressList"),
                oItem = oEvent.getParameter("item");
            oList.insertItem(new ListItem({
                title: "Upload started: " + oItem.getFileName()
            }));
        },

        onUploadProgressed: function (oEvent) {
			var oList = this.byId("progressList"),
				oItem = oEvent.getParameter("item");
			oList.insertItem(new ListItem({
				title: "Upload progressed: " + oItem.getFileName()
			}));
		},

		onUploadCompleted: function (oEvent) {
			var oList = this.byId("progressList"),
				oItem = oEvent.getParameter("item");
			oList.insertItem(new ListItem({
				title: "Upload completed: " + oItem.getFileName()
			}));
		},
        
		onUploadAborted: function (oEvent) {
			var oList = this.byId("progressList"),
				oItem = oEvent.getParameter("item");
			oList.insertItem(new ListItem({
				title: "Upload aborted: " + oItem.getFileName()
			}));
		},

        onAddImage: function() {
            var oUploader = this.getView().byId("imageUploader");
            var sNewImagePath = oUploader.getValue();
            var oModel = this.getView().getModel("imageModel");
            var aImages = oModel.getData().Images;
            
            if (sNewImagePath) {
                aImages.push({src: sNewImagePath});
                oModel.setData({Images: aImages});
                MessageToast.show("Image added");
                oUploader.setValue("");
            } else {
                MessageToast.show("Please choose an image to upload.");
            }
        },
//
        onDeleteImage: function(oEvent) {
            var oList = oEvent.getSource(),
                oItem = oEvent.getParameter("listItem"),
                sPath = oItem.getBindingContextPath(),
                iIndex = parseInt(sPath.split("/")[sPath.split("/").length - 1]),
                oModel = this.getView().getModel("imageModel"),
                aImages = oModel.getData().Images;

            aImages.splice(iIndex, 1);
            oModel.setData({Images: aImages});
            MessageToast.show("Image removed");
        },
//
        onImagePress: function(oEvent) {
            var oDialog = this.getView().byId("fullScreenCarouselDialog");
            if (!oDialog || !oDialog.isOpen()) { 
                console.log("Image pressed");
                var sSrc = oEvent.getSource().getSrc();
                var oCarousel = this.getView().byId("fullScreenCarousel");
                oCarousel.destroyPages();
        
                var aImages = this.getView().getModel("imageModel").getData().Images;
                aImages.forEach(function(img) {
                    oCarousel.addPage(new sap.m.Image({ src: img.src }));
                });
        
                var iActiveIndex = aImages.findIndex(img => img.src === sSrc);
                oCarousel.setActivePage(oCarousel.getPages()[iActiveIndex]);
        
                oDialog.open();
            } 
        },

        onCloseDialog: function() {
            var oDialog = this.getView().byId("fullScreenCarouselDialog");
            oDialog.close();
        },

    });
});