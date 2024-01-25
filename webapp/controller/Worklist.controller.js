sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/format/DateFormat",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
    ],
    function (Controller, DateFormat, Filter, FilterOperator){
        "use strict";

        return Controller.extend("fiorilibappname.controller.Worklist", {
            onInit: function () {
                this._dateFormatter = DateFormat.getDateInstance({
                    pattern: "dd.MM.yyyy",
                });
            },

            onFilterApps: function (oEvent) {
                var sFilter = [];
                var sQuery = oEvent.getParameter("query");
                if (sQuery) {
                    aFilter.push(new Filter("TechnicalName", FilterOperator.Contains, sQuery));
                }

                var oTable = this.getView().byId("all_apps");
                var oBinding = oTable.getBinding("items");
                oBinding.filter(aFilter);
            },

            onPress: function (oEvent) {
                var oItem = oEvent.getSource();
                var oBindingContext = oItem.getBindingContext("odata");
                var sSolId = oBindingContext.getProperty("SolId");
            
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("detail", {
                    solId: sSolId
                });
            },

            onAddButtonPress: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("SolutionCreate");
            }
        });
    }
);