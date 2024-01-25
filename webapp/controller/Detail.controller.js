sap.ui.define(
[
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/List",
    "sap/m/library",
    "sap/m/StandardListItem",
    "sap/m/Text",
],
 function (Controller, History, DateFormat) {
    "use strict";
    
    return Controller.extend("fiorilibappname.controller.Detail", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter
                .getRoute("detail")
                .attachPatternMatched(this._onObjectMatched, this);
            
                this._dateFormatter = DateFormat.getDateInstance({
                    pattern: "dd.MM.yyyy",
                });
        },
        onNavBack: function () {
        this.selectedGenres = [];

        var oHistory = History.getInstance();
        var sPreviousHash = oHistory.getPreviousHash();

        if (sPreviousHash !== undefined) {
          window.history.go(-1);
        } else {
          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.navTo("Main", {}, true);
        }
       },
        formatDate: function (date) {
            return this._dateFormatter.format(date);
        }
    });

 }
);