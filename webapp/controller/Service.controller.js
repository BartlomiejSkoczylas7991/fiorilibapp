sap.ui.define([
    "fiorilibappname/controller/Object.controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (ObjectController, MessageBox, JSONModel) {
    "use strict";

    return ObjectController.extend("fiorilibappname.controller.Service", {
        onInit: function () {
            ObjectController.prototype.onInit.apply(this, arguments);
        },

        onAddService: function () {
            var oModel = this.getView().getModel("detailView");
            var aServices = oModel.getProperty("/to_Service") || [];
            aServices.push({ // Dodaj pusty obiekt (lub z domyślnymi wartościami) dla nowego rekordu
                TarMapId: "",
                Type: "",
                Url: "",
                ParamValue: ""
            });
            oModel.setProperty("/to_Service", aServices);
        },

        onDeleteService: function () {
            var oTable = this.byId("servicesTable");
            var aSelectedItems = oTable.getSelectedItems();
            var oModel = this.getView().getModel("detailView");
            var aServices = oModel.getProperty("/to_Service");
        
            // Usuwaj elementy bazując na kontekście zaznaczonych elementów
            for (var i = aSelectedItems.length - 1; i >= 0; i--) {
                var oContext = aSelectedItems[i].getBindingContext("detailView");
                if (oContext) {
                    var sPath = oContext.getPath();
                    var iIndex = parseInt(sPath.split("/").pop(), 10); // Pobierz indeks elementu z ścieżki
                    aServices.splice(iIndex, 1);
                }
            }
        
            oModel.setProperty("/to_Service", aServices);
            oTable.removeSelections(); // Czyści zaznaczenie
        }
    });
});