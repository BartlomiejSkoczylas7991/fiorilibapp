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
            
            var oDetailModel = this.getOwnerComponent().getModel("detailView");
            console.log(oDetailModel);
            //var oDetailModel = this.getView().getElementBinding().getBoundContext().getObject();
            //console.log(oDetailModel);
            console.log("Data from detailView model: ", oDetailModel.getData());
        },

        onFileSelected: function(oEvent) {
            var oFile = oEvent.getParameter("files")[0];
            if (oFile) {
                var oReader = new FileReader();

                oReader.onload = function(oEvent) {
                    var sBase64Data = oEvent.target.result.split(",")[1];
                    var oModel = this.getView().getModel("detailView");
                    var aImages = oModel.getProperty("/to_Image") || [];
                    aImages.push({
                        Filename: oFile.name,
                        Mimetype: oFile.type,
                        Attachment: sBase64Data,
                        Uploaded: false
                    });
                    oModel.setProperty("/to_Image", aImages);
                }.bind(this);

                oReader.readAsDataURL(oFile);
            }
        },


        // potrzebne do upload set
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


        // potrzebne do UploadSet
        onDeleteImage: function(oEvent) {
            var oList = oEvent.getSource(),
                oItem = oEvent.getParameter("listItem"),
                sPath = oItem.getBindingContextPath(),
                iIndex = parseInt(sPath.split("/")[sPath.split("/").length - 1]),
                oModel = this.getOwnerComponent().getModel("imageModel"),
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

                var oModel = this.getOwnerComponent().getModel(); 
                var oDetailModel = this.getView().getModel("detailView");
                var sPath = oDetailModel.getData().__metadata.uri + "/to_Image";
                console.log("WCISNIETE", oDetailModel.getData()); 
                console.log("DANE to_Image", sPath);
                //oCarousel.destroyPages();
        //
                //var aImages = this.getView().getModel("imageModel").getData().Images;
                //aImages.forEach(function(img) {
                //    oCarousel.addPage(new sap.m.Image({ src: img.src }));
                //});
        //
                //var iActiveIndex = aImages.findIndex(img => img.src === sSrc);
                //oCarousel.setActivePage(oCarousel.getPages()[iActiveIndex]);
        
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