sap.ui.define([
    "fiorilibappname/controller/Object.controller",
    "sap/m/library",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Item",
	"sap/ui/model/json/JSONModel",
	"sap/m/upload/Uploader",
	"sap/m/StandardListItem",
	"sap/m/MessageToast"
], function (ObjectController, MobileLibrary, Controller, Item, JSONModel, Uploader, ListItem, MessageToast) {
    "use strict";

    //var ListMode = MobileLibrary.ListMode;
    //var CustomUploader = Uploader.extend("sap.m.sample.UploadSetCustomUploader.CustomUploader", {
    //    metadata: {}
    //});


    return ObjectController.extend("fiorilibappname.controller.Image", {
        onInit: function () {
            ObjectController.prototype.onInit.apply(this, arguments);
            

            // by uploader
            //var sPath = sap.ui.require.toUrl("sap/m/sample/UploadSetCustomUploader/items.json"),
            //    oUploadSet = this.byId("UploadSet"),
            //    oCustomUploader = new CustomUploader();
//
            //this.getView().setModel(new JSONModel(sPath));
//
            //oUploadSet.setUploader(oCustomUploader);
            //oUploadSet.regusterUploadedEvents(oCustomUploader);
//
            //oCustomUploader.attachUploadStarted(this.onUploadStarted.bind(this));
            //oCustomUploader.attachUploadProgressed(this.onUploadProgressed.bind(this));
            //oCustomUploader.attachUploadCompleted(this.onUploadCompleted.bind(this));
            //oCustomUploader.attachUploadAborted(this.onUploadAborted.bind(this));
//
            //oUploadSet.getList
        },

        //onAddImage: function() {
        //    var oUploader = this.getView().byId("imageUploader");
        //    var sNewImagePath = oUploader.getValue();
        //    var oModel = this.getView().getModel("imageModel");
        //    var aImages = oModel.getData().Images;
        //    
        //    if (sNewImagePath) {
        //        aImages.push({src: sNewImagePath});
        //        oModel.setData({Images: aImages});
        //        MessageToast.show("Image added");
        //        oUploader.setValue("");
        //    } else {
        //        MessageToast.show("Please choose an image to upload.");
        //    }
        //},
//
        //onDeleteImage: function(oEvent) {
        //    var oList = oEvent.getSource(),
        //        oItem = oEvent.getParameter("listItem"),
        //        sPath = oItem.getBindingContextPath(),
        //        iIndex = parseInt(sPath.split("/")[sPath.split("/").length - 1]),
        //        oModel = this.getView().getModel("imageModel"),
        //        aImages = oModel.getData().Images;
//
        //    aImages.splice(iIndex, 1);
        //    oModel.setData({Images: aImages});
        //    MessageToast.show("Image removed");
        //},
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