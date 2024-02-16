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
            oRouter.
                getRoute("detail").
                attachPatternMatched(this._onObjectMatched, this);

            var oModel = this.getOwnerComponent().getModel();
            if (!oModel) {
                console.error("Model not found");
            } else {
                console.log("Model found", oModel);
            }
            this._dateFormatter = DateFormat.getDateInstance({
                pattern: "dd.MM.yyyy",
            });
        },

        _onObjectMatched: function (oEvent) {
            this._sSolId = oEvent.getParameter("arguments").solId;
        
            var oModel = this.getView().getModel();
            var sPath = "/ZC_BSK_LA_SOLUTION('" + this._sSolId + "')";
        
            oModel.read(sPath, {
                success: function (oData) {
                
                    this.getView().setBindingContext(new sap.ui.model.Context(oModel, sPath));
        
                
                    this._loadTargetMappings(sSolId);
                    this._loadServices(sSolId);
                }.bind(this),
                error: function (oError) {
                    MessageBox.error("Error during loading data.");
                }
            });
        },
        
        _loadData: function(sSolId) {
            var oModel = this.getView().getModel();
            if (!oModel) {
                console.error("Model not found");
                return;
            }
            
            var sPath = "/ZC_BSK_LA_SOLUTION('" + sSolId + "')";
            oModel.read(sPath, {
                success: function (oData) {
                    var oContext = new sap.ui.model.Context(oModel, sPath);
                    this.getView().setBindingContext(oContext);
                    
                    // Ustawienie kontekstu dla tabel Target Mappings i Services
                    var oTargetMappingsTable = this.byId("targetMappingsTable");
                    var oServicesTable = this.byId("servicesTable");
                    oTargetMappingsTable.setBindingContext(oContext);
                    oServicesTable.setBindingContext(oContext);
                }.bind(this),
                error: function (oError) {
                    MessageBox.error("Error during loading data.");
                }
            });
        },        
    
        _loadTargetMappings: function (sSolId) {
            var oModel = this.getView().getModel("odata");
            var sPath = "/ZC_BSK_LA_SOLUTION('" + sSolId + "')/to_Tar_Map";
            oModel.read(sPath, {
                success: function (oData) {
                    // Przetwarzaj dane oData, jeśli potrzebujesz
                },
                error: function (oError) {
                    MessageBox.error("Error during loading Target Mappings.");
                }
            });
        },
        
        _loadServices: function (sSolId) {
            var oModel = this.getView().getModel("odata");
            var sPath = "/ZC_BSK_LA_SOLUTION('" + sSolId + "')/to_Service";
            oModel.read(sPath, {
                success: function (oData) {
                    // Przetwarzaj dane oData, jeśli potrzebujesz
                },
                error: function (oError) {
                    MessageBox.error("Error during loading Services.");
                }
            });
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

        formatDate: function (sTimestamp) {
            if (!sTimestamp) {
                return "";
            }
            // Zakładając, że sTimestamp jest w formacie "YYYYMMDDhhmmss"
            var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd'T'HH:mm:ss"});
            var oDate = oDateFormat.parse(sTimestamp.substring(0, 4) + "-" + sTimestamp.substring(4, 6) + "-" + sTimestamp.substring(6, 8) + "T" + sTimestamp.substring(8, 10) + ":" + sTimestamp.substring(10, 12) + ":" + sTimestamp.substring(12, 14));
            
            var oDisplayFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "dd.MM.yyyy HH:mm:ss"});
            return oDisplayFormat.format(oDate);
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
            var oModel = this.getView().getModel();
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
        }
    });
});
