sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat",
    "sap/m/MessageBox",
    // inne zależności
], function (Controller, History, DateFormat, MessageBox) {
    "use strict";

    return Controller.extend("fiorilibappname.controller.Detail", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
        
            this._dateFormatter = DateFormat.getDateInstance({
                pattern: "dd.MM.yyyy",
            });
        
            this._sSolId = null;
        },

        _onObjectMatched: function (oEvent) {
            this._sSolId = oEvent.getParameter("arguments").solId;
        
            var oModel = this.getView().getModel("odata");
            var sPath = "/ZC_BSK_LA_SOLUTION('" + this._sSolId + "')";
        
            oModel.read(sPath, {
                success: function (oData) {
                
                    this.getView().setBindingContext(new sap.ui.model.Context(oModel, sPath), "odata");
        
                
                    this._loadTargetMappings(this._sSolId);
                    this._loadServices(this._sSolId);
                }.bind(this),
                error: function (oError) {
                    MessageBox.error("Error during loading data.");
                }
            });
        },
        _loadTargetMappings: function (sSolId) {
            var oTable = this.byId("targetMappingsTable");
            var oBinding = oTable.getBinding("items");
            
            if (oBinding) {
                var oFilter = new sap.ui.model.Filter("SolId", sap.ui.model.FilterOperator.EQ, sSolId);
                oBinding.filter([oFilter]);
            }
        },
        
        _loadServices: function (sSolId) {
            var oTable = this.byId("servicesTable");
            var oBinding = oTable.getBinding("items");
            
            if (oBinding) {
                var oFilter = new sap.ui.model.Filter("SolId", sap.ui.model.FilterOperator.EQ, sSolId);
                oBinding.filter([oFilter]);
            }
        },

        onEditPress: function () {
           
            MessageBox.show("Edit function hasn't been implemented yet.");
        },

        onDeletePress: function () {
         
            MessageBox.confirm("Are you sure you want to delete the item?", {
                title: "Confirmation",
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {

                    }
                }
            });
        },

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Main", {}, true);
            }
        },

        onPostComment: function (oEvent) {
            var oModel = this.getView().getModel("odata");
            var sCommentText = oEvent.getParameter("value");
        
            if (!sCommentText.trim()) {
                MessageBox.warning("Please enter a comment.");
                return;
            }
        
            if (!this._sSolId) {
                MessageBox.error("Solution ID is not available.");
                return;
            }
        
            var oNewComment = {
                SolId: this._sSolId,
                Title: "User Comment",
                Text: sCommentText,
                Created: new Date()
            };
        
            oModel.create("/ZC_BSK_LA_COMM", oNewComment, {
                success: function () {
                    MessageBox.success("Comment posted successfully.");
                    this._refreshComments(this._sSolId);
                }.bind(this),
                error: function () {
                    MessageBox.error("Error posting comment.");
                }
            });
        },

        _refreshComments: function (sSolId) {
            var oCommentsList = this.byId("commentsList");
            var oBinding = oCommentsList.getBinding("items");
            oBinding.filter(new sap.ui.model.Filter("SolId", sap.ui.model.FilterOperator.EQ, sSolId));
            oBinding.refresh();
        },

        formatDate: function (date) {
            return this._dateFormatter.format(new Date(date));
        }

    });
});
