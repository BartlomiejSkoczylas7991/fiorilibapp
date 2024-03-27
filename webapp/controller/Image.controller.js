sap.ui.define([
    "sap/m/library",
    "fiorilibappname/controller/Object.controller",
	"sap/ui/core/Item",
	"sap/ui/model/json/JSONModel",
	"sap/m/upload/Uploader",
	"sap/m/StandardListItem",
	"sap/m/MessageToast"
], function (MobileLibrary, ObjectController, Item, JSONModel, Uploader, ListItem, MessageToast) {
    "use strict";
    return ObjectController.extend("fiorilibappname.controller.Image", {

        onInit: function () {
            ObjectController.prototype.onInit.apply(this, arguments);

            var oDetailModel = this.getView().getBindingContext().getObject();
            console.log(oDetailModel);
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

        formatImageSrc: function(sBase64Value) {
            return "data:image/jpeg;base64," + sBase64Value;
        },
        
        // Dialog
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

        // zamykanie okienka dialog
        onCloseDialog: function() {
            var oDialog = this.getView().byId("fullScreenCarouselDialog");
            oDialog.close();
        },

    });
});