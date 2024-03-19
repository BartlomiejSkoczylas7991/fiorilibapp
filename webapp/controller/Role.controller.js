sap.ui.define([
    "fiorilibappname/controller/Object.controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (ObjectController, MessageBox, JSONModel) {
    "use strict";

    return ObjectController.extend("fiorilibappname.controller.Role", {
        onInit: function () {
            ObjectController.prototype.onInit.apply(this, arguments);
        },

        onAddRole: function () {
            var oModel = this.getView().getModel("singleSolutionModel");
            var aRoles = oModel.getProperty("/to_S_Role") || [];
            aRoles.push({
                RoleId: "",
                TechName: "",
                AccessLevel: "",
                Description: ""
            });
            oModel.setProperty("/to_S_Role", aRoles);
        },
        
        onDeleteRole: function () {
            var oTable = this.byId("rolesTable");
            var aSelectedItems = oTable.getSelectedItems();
            var oModel = this.getView().getModel("roleModelEdit");
            var aRoles = oModel.getProperty("/to_S_Role");
        
            for (var i = aSelectedItems.length - 1; i >= 0; i--) {
                var oContext = aSelectedItems[i].getBindingContext("roleModelEdit");
                if (oContext) {
                    var sPath = oContext.getPath();
                    var iIndex = parseInt(sPath.split("/").pop(), 10); 
                    aRoles.splice(iIndex, 1);
                }
            }
        
            oModel.setProperty("/to_S_Role", aRoles);
            oTable.removeSelections();
        },

        openRolesDialog: function() {
            if (!this._rolesDialog) {
                this._rolesDialog = sap.ui.xmlfragment("fiorilibappname.SharedBlocks.technicalInformation.RolesDialog", this);
                this.getView().addDependent(this._rolesDialog);
                this._rolesDialog.setModel(this.getView().getModel("viewGlobal"));
            }
            this._rolesDialog.open();
        },

        confirmRoleSelection: function() {
            var oTable = this._rolesDialog.getContent()[0];
            var aSelectedItems = oTable.getSelectedItems();
            var aSelectedRoles = aSelectedItems.map(item => item.getBindingContext("viewGlobal").getObject());
        
            var oRoleModel = this.getView().getModel("roleModelEdit");
            var aCurrentRoles = oRoleModel.getProperty("/to_S_Role");
        
            var aNewRoles = aSelectedRoles.filter(selectedRole => {
                return !aCurrentRoles.some(currentRole => currentRole.RoleId === selectedRole.RoleId);
            });
        
            if (aNewRoles.length > 0) {
                var aUpdatedRoles = aCurrentRoles.concat(aNewRoles);
                oRoleModel.setProperty("/to_S_Role", aUpdatedRoles);
            } else {
                MessageBox.information("No new roles selected or the selected roles already exist.");
            }
        
            this._rolesDialog.close();
        },

        closeRolesDialog: function() {
            if (this._rolesDialog) {
                this._rolesDialog.close();
            }
        },

        filterRoles: function(oEvent) {
            var sQuery = oEvent.getParameter("newValue").toUpperCase();
            var oFilter = new sap.ui.model.Filter("RoleId", sap.ui.model.FilterOperator.Contains, sQuery);
            var oTable = this._rolesDialog.getContent()[1]; 
            var oBinding = oTable.getBinding("items");
            oBinding.filter([oFilter]);
        }
    });
});