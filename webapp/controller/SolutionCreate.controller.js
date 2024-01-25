sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("fiorilibappname.controller.SolutionCreate", {
        onInit: function () {
            var oModel = new JSONModel({
                newSolution: {
                    TechnicalName: "",
                    Url: "",
                },
                targetMappings: [],
                services: [],
                versions: []
            });
            this.getView().setModel(oModel);
        },

        onAddTargetMapping: function () {
            var oData = this.getView().getModel().getData();
            var oNewTargetMapping = {
                Url: this.byId("targetMappingURL").getValue(),
                Type: this.byId("targetMappingType").getValue(),
                ParamValue: this.byId("targetMappingParamValue").getValue(),
            };
            oData.targetMappings.push(oNewTargetMapping);
            this.getView().getModel().refresh();
        },

        onDeleteTargetMapping: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var sPath = oItem.getBindingContext().getPath();
            var iIndex = parseInt(sPath.substring(sPath.lastIndexOf("/") + 1));
            var oData = this.getView().getModel().getData();
            oData.targetMappings.splice(iIndex, 1);
            this.getView().getModel().refresh();
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
            var oModel = this.getView().getModel("odata");
            var oData = this.getView().getModel().getData();
        
            oModel.setUseBatch(true);
            oModel.setDeferredGroups(["batchGroupId"]);
            
            oModel.create("/ZC_BSK_LA_SOLUTION", oData.newSolution, { groupId: "batchGroupId" });
        
            oData.targetMappings.forEach(function (targetMapping) {
                oModel.create("/ZC_BSK_LA_TAR_MAP", targetMapping, { groupId: "batchGroupId" });
            });
        
            oData.services.forEach(function (service) {
                oModel.create("/ZC_BSK_LA_SERVICE", service, { groupId: "batchGroupId" });
            });
        
            oData.versions.forEach(function (version) {
                oModel.create("/ZC_BSK_LA_VERSION", version, { groupId: "batchGroupId" });
            });
   
            oModel.submitChanges({
                groupId: "batchGroupId",
                success: function (oResponse) {
                    sap.m.MessageToast.show("Success!");
               
                },
                error: function (oError) {
                    sap.m.MessageBox.error("Error occurred during save.");
                 
                }
            });
        }
        

    });
});
