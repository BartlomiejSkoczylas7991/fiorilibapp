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
            var viewModel = this.getOwnerComponent().getModel("viewModel");
            this.getOwnerComponent().setModel(viewModel, "viewModel");
            var viewDetail = new JSONModel({});
            this.getView().setModel(viewDetail, "viewDetail");

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
            oRouter.getRoute("Create").attachPatternMatched(this._onObjectMatched, this);
        
            this._dateFormatter = DateFormat.getDateInstance({
                pattern: "dd.MM.yyyy",
            });
        },

        _onObjectMatched: function (oEvent) {
            const sRouteName = oEvent.getParameter("name");
            var oViewModel = this.getOwnerComponent().getModel("viewModel");
            var oDetailModel = this.getView().getModel("viewDetail");

            let emptyData = {};

            if (sRouteName === "Create") {
                oViewModel.setProperty("/isEditMode", true);
                oViewModel.setData(emptyData);
                oDetailModel.setData(emptyData); 
                this.getView().getModel("viewDetail").setData(emptyData);
            } else if (sRouteName === "Detail") {
                this._sSolId = oEvent.getParameter("arguments").SolId;
                oViewModel.setProperty("/isEditMode", false);
                if (this._sSolId) {
                    this._loadData(this._sSolId);
                } else {
                    oViewModel.setProperty("/isEditMode", true);
                    oViewModel.setData(emptyData);
                    this.getView().getModel("viewDetail").setData(emptyData);
                }
            }
        },

        onExit: function () {
            this.oRouter.detachRouteMatched(this.onRouteMatched, this);
        },

        _initializeNewSolution: function () {
            var oNewSolutionData = {
            };
            this.getView().getModel().setData(oNewSolutionData);
        },
        
        _loadData: function (sSolId) {
            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/ZC_BSK_LA_SOLUTION('" + sSolId + "')";
            
        
            oModel.read(sPath, {
                success: function (oData) {
                    var oViewModel = this.getView().getModel("viewModel");
                    var oDetailModel = this.getView().getModel("viewDetail");

                    oViewModel.setData(oData);
                    oDetailModel.setData(JSON.parse(JSON.stringify(oData)));

                    this._loadServices(sSolId);
                }.bind(this),
                error: function (oError) {
                    MessageBox.error("Error during loading data.");
                }
            });
        },       

        onNavBack: function () {
            this.getView().getModel("viewModel").setData({});

            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Worklist", {}, true);
            }
        },
    
        onEditPress: function() {
            var oViewModelData = this.getView().getModel("viewModel").getData();
            this.getView().getModel("viewDetail").setData(JSON.parse(JSON.stringify(oViewModelData)));
            this.getView().getModel("viewModel").setProperty("/isEditMode", true);
        },        

        onSavePress: function() {
            var oDetailModel = this.getView().getModel("viewDetail");
            var oModel = this.getOwnerComponent().getModel();
            var oOriginalData = this.getOwnerComponent().getModel("viewModel").getData();

            var oUpdatedData = oDetailModel.getData();

            if (this._sSolId) {
                var sPath = "/ZC_BSK_LA_SOLUTION('" + this._sSolId + "')";
                oModel.update(sPath, oUpdatedData, {
                    success: function() {
                        MessageBox.success("Object updated successfully.");
                        this.getView().getModel("viewModel").setProperty("/isEditMode", false);
                        this._loadData(this._sSolId);
                    }.bind(this),
                    error: function() {
                        MessageBox.error("Update failed.");
                    }
                });
            } else {
                oModel.create("/ZC_BSK_LA_SOLUTION", oUpdatedData, {
                    success: function() {
                        MessageBox.success("New object created successfully.");
                        this.getView().getModel("viewModel").setProperty("/isEditMode", false);
                        // mogę zrobić sobie nawigację do tego obiektu - generalnie rozwinąć do batcha
                        this.getOwnerComponent().getRouter().navTo("Worklist");
                    }.bind(this),
                    error: function() {
                        MessageBox.error("Creation failed.");
                    }
                });
            }

            this._manageServices(oUpdatedData.to_Service, oOriginalData.to_Service)
        },

        onCancelPress: function() {
            if (this._sSolId) {
                this._loadData(this._sSolId);
            } else {
                let emptyData = { TechnicalName: "", Url: "", Description: "" };
                this.getView().getModel("viewDetail").setData(emptyData);
                this.getView().getModel("viewModel").setData(emptyData);
            }
            this.getOwnerComponent().getModel("viewModel").setProperty("/isEditMode", false);
        },

        onAddNewServiceItem: function() {
            var oModel = this.getView().getModel("viewDetail");
            var oNewService = oModel.getProperty("/newService");

            if (!oNewService.Url || !oNewService.Version) {
                MessageBox.error("Please fill in all required fields.");
                return;
            }
            var aServices = oModel.getProperty("/to_Service") || [];
            aServices.push(Object.assign({}, oNewService)); 

            oModel.setProperty("/to_Service", aServices);
            oModel.setProperty("/newService", {Url: "", Version: "", Description: "", ExtServName: "", SoftCompVersion: "", BeAuthRole: "" })
        },
        
        onDeleteSelectedServices: function() {
            var oTable = this.byId("editableTableService");
            var aSelectedItems = oTable.getSelectedItems();
            var oModel = this.getView().getModel("viewDetail");
            var aServices = oModel.getProperty("/to_Service") || [];

            for (var i = aSelectedItems.length - 1; i >= 0; i--) {
                var oContext = aSelectedItems[i].getBindingContext("viewDetail");
                if (oContext) {
                    var iIndex = oContext.getPath().split("/").pop();
                    aServices.splice(parseInt(iIndex, 10), 1);
                }
            }
        
            oModel.setProperty("/to_Service", aServices);
            oTable.removeSelections();
        },

        _manageServices: function(updatedServices, originalServices) {
            var oModel = this.getView().getModel();
            var aBatchOperations = [];

            var originalServicesMap = {};
            originalServices.forEach(function(service) {
                originalServicesMap[service.ServiceId] = service;
            });

            updatedServices.forEach(function(service) {
                if (service.ServiceId && originalServicesMap[service.ServiceId]) {
                    var sPath = "/Services(" + service.ServiceId + ")";
                    aBatchOperations.push(oModel.createBatchOperation(sPath, "PUT", service))
                } else if (!service.ServiceId) {
                    aBatchOperations.push(oModel.createBatchOperation("/Services", "POST", service));
                }
            });

            originalServices.forEach(function(service) {
                if (!updatedServices.find(function(updatedService) { return updatedService.ServiceId === service.ServiceId; })){
                    var sPath = "/Services(" + service.ServiceId + ")";
                    aBatchOperations.push(oModel.createBatchOperation(sPath, "DELETE"));
                }
            });

            if (aBatchOperations.length > 0) {
                oModel.addBatchChangeOperations(aBatchOperations);
                oModel.submitBatch(function(oData) {
                    MessageBox.success("Services updated successfully.");
                }, function(oError) {
                    MessageBox.error("Error updating services.");
                });
            }
        },

        _loadServices: function (sSolId) {
            var oModel = this.getOwnerComponent().getModel();
            var sPath = "/ZC_BSK_LA_SOLUTION('" + sSolId + "')/to_Service";

            oModel.read(sPath, {
                success: function (oData) {
                    var oViewModel = this.getView().getModel("viewModel");
                    var oDetailModel = this.getView().getModel("viewDetail");

                    oViewModel.setProperty("/to_Service", oData.results);
                    oDetailModel.setProperty("/to_service", oData.results);

                }.bind(this),
                error: function (oError) {
                    MessageBox.error("Error during loading Services.");
                }
            })
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
        
        _loadTargetMappings: function (sSolId) {
            var oModel = this.getView().getModel();
            var sPath = "/ZC_BSK_LA_SOLUTION('" + sSolId + "')/to_Tar_Map";
            oModel.read(sPath, {
                success: function (oData) {
                },
                error: function (oError) {
                    MessageBox.error("Error during loading Target Mappings.");
            }
        });
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
