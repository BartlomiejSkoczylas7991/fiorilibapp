sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("fiorilibappname.controller.SolutionCreate", {
        onInit: function () {
            var oModel = new JSONModel({
                newSolution: {},
                targetMappings: [],
                services: [],
                versions: []
            });
            this.getView().setModel(oModel);
        },

        onAddTargetMapping: function() {
            var oModel = this.getView().getModel();
            var oData = oModel.getData();
        
            oData.targetMappings.push(Object.assign({}, oData.newTargetMapping));
        
            oData.newTargetMapping = { Url: "", Type: "", ParamValue: "" };
        
            oModel.refresh();
        },
        
        onDeleteTargetMapping: function(oEvent) {
            var oModel = this.getView().getModel();
            var oData = oModel.getData();
            var sPath = oEvent.getParameter('listItem').getBindingContextPath();
            var iIndex = parseInt(sPath.split("/")[2]);
        
            oData.targetMappings.splice(iIndex, 1);
            
            oModel.refresh();
        },

        onAddService: function () {
            var oData = this.getView().getModel().getData();
            var oNewService = {
                Url: this.byId("serviceURL").getValue(),
                Version: this.byId("serviceVersion").getValue(),
            };
            oData.services.push(oNewService);
            this.getView().getModel().refresh();
        },
        
        onDeleteService: function (oEvent) {
         
        },
        
        onAddVersion: function () {
            var oData = this.getView().getModel().getData();
            var oNewVersion = {
                Title: this.byId("versionTitle").getValue(),
                Description: this.byId("versionDescription").getValue(),
            };
            oData.versions.push(oNewVersion);
            this.getView().getModel().refresh();
        },
        
        onDeleteVersion: function (oEvent) {
        },
        onSave: function () {
            console.log("Save button pressed.");
            
            var oModel = this.getView().getModel();
            var oData = oModel.getData().newSolution;

            if (!oData.TechnicalName || !oData.Url) {
                MessageBox.error("Please fill all required fields.");
                return;
            }

            oModel.create("/ZC_BSK_LA_SOLUTION", oData, {
            success: function (oResponse) {
                MessageBox.success("Solution created successfully.");
            },
            error: function (oError) {
                MessageBox.error("Error occurred during save.");
        }
    });
}
        
    });
});
