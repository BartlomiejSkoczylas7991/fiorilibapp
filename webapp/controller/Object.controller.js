sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
], function (Controller, History, DateFormat, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("fiorilibappname.controller.Object", {

        onInit: function () {
            var oViewModel = new JSONModel({
                isEditMode: false
            });
            this.getView().setModel(oViewModel, "viewModel");

            var oRouter = this.getOwnerComponent().getRouter();
            
            oRouter.
                getRoute("Detail").
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
            this._sSolId = oEvent.getParameter("arguments").SolId;

            if(this._sSolId) {
                var oEditButton = this.getView().byId("editButton");
                var oSaveButton = this.getView().byId("saveButton");
                if (oEditButton && oSaveButton){
                    oEditButton.setVisible(true);
                    oSaveButton.setVisible(false);
                }
                this._loadData(this._sSolId);
            } else {
                if (oEditButton && oSaveButton) {
                    oEditButton.setVisible(false);
                    oSaveButton.setVisible(true);
                }
                this._initializeNewSolution();
            }
            
            var oModel = this.getView().getModel();
            var sPath = "/ZC_BSK_LA_SOLUTION('" + this._sSolId + "')";
        
            oModel.read(sPath, {
                success: function (oData) {
                
                    this.getView().setBindingContext(new sap.ui.model.Context(oModel, sPath));
        
                
                    this._loadTargetMappings(this._sSolId);
                    this._loadServices(this._sSolId);
                }.bind(this),
                error: function (oError) {
                    MessageBox.error("Error during loading data.");
                }
            });
        },

        _initializeNewSolution: function () {
            var oNewSolutionData = {
                TechnicalName: "",
                Url: ""
            };
            this.getView().getModel().setData(oNewSolutionData);
        },
        
        _loadData: function(sSolId) {
            var oModel = this.getView().getModel();
            if (!oModel) {
                console.error("Model not found");
                return;
            }
            
            var sPath = "/ZC_BSK_LA_SOLUTION('" + sSolId + "')";
            var oDataModel = this.getView().getModel(); 
            oModel.read(sPath, {
                success: function (oData) {
                    var oContext = new sap.ui.model.Context(oModel, sPath);
                    this.getView().setBindingContext(oContext);
                    
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
                },
                error: function (oError) {
                    MessageBox.error("Error during loading Services.");
                }
            });
        },        

        onEditPress: function () {
            this.getView().getModel("viewModel").setProperty("/isEditMode", true);
        },

        onSavePress: function() {
            var oModel = this.getView().getModel();
            var sPath = this.getView().getBindingContext().getPath();
            var oData = this.getView().getBindingContext().getObject();

            var oUpdatedData = {
                TechnicalName: this.getView().byId("idInputTechnicalName").getValue(),
                Url: this.getView().byId("idInputUrl").getValue(),
                Description: this.getView().byId("idInputDescription").getValue()
            };
        
            oModel.update(sPath, oUpdatedData, {
                success: function () {
                    MessageBox.success("Object updated successfully.");
                    this.getView().getModel("viewModel").setProperty("/isEditMode", false);
                }.bind(this),
                error: function () {
                    MessageBox.error("Update failed.");
                }
            });
        },
        
        onCancelPress: function() {
            this.getView().getModel().resetChanges();
            this.getView().getModel("viewModel").setProperty("/isEditMode", false);
        },

        onDeletePress: function () {
            var oModel = this.getView().getModel();
            var sPath = this.getView().getBindingContext().getPath();

            MessageBox.confirm("Are you sure you want to delete?", {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.YES) {
                        oModel.remove(sPath, {
                            success: function () {
                                MessageBox.success("Object deleted successfully.");
                            },
                            error: function () {
                                MessageBox.error("Deletion failed.");
                            }
                        });
                    }
                }
            });
        },

        formatDate: function (sTimestamp) {
            if (!sTimestamp) {
                return "";
            }
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
