sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("fiorilibappname.controller.BaseController", {
        initializeModels: function () {
            this.getView().setModel(new JSONModel(), "global");
        },

        getRouter : function () {
            return this.getOwnerComponent().getRouter();
        },

        getResourceBundle : function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        getModel : function (sName) {
            return this.getView().getModel(sName) || this.getOwnerComponent().getModel(sName);
        },

        setModel : function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        _getFilters: function (sStatus) {
            var aFilters = [];
            if (sStatus) {
                var oStatusFilter = new sap.ui.model.Filter("StatusDescription", sap.ui.model.FilterOperator.EQ, sStatus);
                aFilters.push(oStatusFilter);
            }
            return aFilters;
        },

        loadValueHelps: function () {
        }
    });
});
