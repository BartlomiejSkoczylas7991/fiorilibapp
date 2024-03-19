sap.ui.define([
    "fiorilibappname/controller/Object.controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (ObjectController, MessageBox, JSONModel) {
    "use strict";

    return ObjectController.extend("fiorilibappname.controller.TargetMappings", {
        onInit: function () {
            ObjectController.prototype.onInit.apply(this, arguments);
        },

        onAddService: function () {
            var oModel = this.getView().getModel("detailView");
            var aTarMap = oModel.getProperty("/to_Tar_Map") || [];
            aTarMap.push({
                ServiceId: "",
                Description: "",
                Version: "",
                Url: "",
                ExtServName: "",
                SoftCompVersion: "",
                BeAuthRole: ""
            });
            oModel.setProperty("/to_Tar_Map", aServices);
        },

        onDeleteService: function () {
            var oTable = this.byId("servicesTable");
            var aSelectedItems = oTable.getSelectedItems();
            var oModel = this.getView().getModel("detailView");
            var aServices = oModel.getProperty("/to_Tar_Map");
        
            for (var i = aSelectedItems.length - 1; i >= 0; i--) {
                var oContext = aSelectedItems[i].getBindingContext("detailView");
                if (oContext) {
                    var sPath = oContext.getPath();
                    var iIndex = parseInt(sPath.split("/").pop(), 10);
                    aServices.splice(iIndex, 1);
                }
            }
        
            oModel.setProperty("/to_Tar_Map", aTarMap);
            oTable.removeSelections(); // Czyści zaznaczenie
        }
    });
});