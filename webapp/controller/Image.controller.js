sap.ui.define([
    "fiorilibappname/controller/Object.controller"
], function (ObjectController) {
    "use strict";

    return ObjectController.extend("fiorilibappname.controller.Image", {
        onInit: function () {
            ObjectController.prototype.onInit.apply(this, arguments);

        },

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
        }

    });
});