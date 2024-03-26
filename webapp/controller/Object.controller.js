sap.ui.define([
    "fiorilibappname/controller/BaseController",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'sap/ui/webc/fiori/library'
], function (BaseController, History, DateFormat, JSONModel, MessageBox, library) {
    "use strict";

    return BaseController.extend("fiorilibappname.controller.Object", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
            oRouter.getRoute("Create").attachPatternMatched(this._onObjectMatched, this);
 
            this.setModel(new JSONModel(), "singleSolutionModel");
            this.setModel(new JSONModel(), "detailView");
            this.setModel(new JSONModel(), "viewSettings");
            
            this.setModel(new JSONModel(), "detailView");
            this._dateFormatter = DateFormat.getDateInstance({
                pattern: "dd.MM.yyyy",
            });
        },

        _bindView: function (sObjectPath) {
            var oView = this.getView();
            oView.bindElement({
                path: sObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function () {
                        oView.setBusy(true);
                    },
                    dataReceived: function () {
                        oView.setBusy(false);
                    }
                }
            });
        },

        _onObjectMatched: function (oEvent) {
            var oValueHelpModel = this.getOwnerComponent().getModel("valueHelp");
            this.setModel(oValueHelpModel, "valueHelp");

            var sSolId = parseInt(oEvent.getParameter("arguments").SolId);
        
            const sRouteName = oEvent.getParameter("name");
            if (sRouteName === "Create"){
                this.getModel("viewSettings").setProperty("/isEditMode", true);
                this.getModel("viewSettings").setProperty("/currentRoute", sRouteName);

                this.setDefaultValues();
                this.getModel("singleSolutionModel").setData({});
                this.getModel("detailView").setData({});
            } else if (sRouteName === "Detail"){
                this.getOwnerComponent().getModel().metadataLoaded().then(function (){
                    var sObjectPath = this.getOwnerComponent().getModel().createKey("ZC_BSK_LA_SOLUTION", {
                        SolId: sSolId
                    });
                    this._bindView("/" + sObjectPath);

                    this.getModel("viewSettings").setProperty("/isEditMode", false);
                    this.getModel("viewSettings").setProperty("/currentRoute", sRouteName);
                    this._loadData(sSolId);

                }.bind(this));
            } else {
                // TODO:  Handle nav error
            }
        },

        _onBindingChange: function() {
            var oView = this.getView();
            var oElementBinding = oView.getElementBinding();
        
            if (!oElementBinding.getBoundContext()) {
                setTimeout(function() {
                    if (!oElementBinding.getBoundContext()) {
                        MessageBox.error("You cannot load the data for the selected item.");
                    } else {
                        var oData = oElementBinding.getBoundContext().getObject();
                        var oSingleSolutionModel = new JSONModel(oData);
                        this.setModel(oSingleSolutionModel, "singleSolutionModel");
                        this.setModel(oSingleSolutionModel, "detailView");
                    }
                }.bind(this), 1000);
                return;
            }
            var oData = oElementBinding.getBoundContext().getObject();
            var oSingleSolutionModel = new JSONModel(oData);
            this.setModel(oSingleSolutionModel, "singleSolutionModel");
            this.setModel(oSingleSolutionModel, "detailView");
        },

        onExit: function () {
            this.oRouter.detachRouteMatched(this.onRouteMatched, this);
        },

        onBeforeNavigate: function (oEvent) {
            var oGlobalModel = this.getModel();
        
            if (!oGlobalModel.getProperty("/isEditMode")) {
                return;
            };
        },
        
        _loadData: function (sSolId) {
            var oGlobalModel = this.getOwnerComponent().getModel();
            var aSolutions = oGlobalModel.getProperty("/ZC_BSK_LA_SOLUTION");
            //var oSelectedSolution = aSolutions.find(solution => solution.SolId === sSolId);
            this._sSolId = sSolId; 
            //if (oSelectedSolution) {
            console.log(this.getView().getModel("singleSolutionModel").getData());    
                //var aRolesForSolution = oSelectedSolution.to_S_Role.map(role => {
                //    return oGlobalModel.getProperty("/Role").find(r => r.RoleId === role.RoleId);
                //}).filter(role => role);
//
                //var oRoleModelEdit = new JSONModel({to_S_Role: aRolesForSolution});
                //this.getView().setModel(oRoleModelEdit, "roleModelEdit");
//
                //this.getModel("singleSolutionModel").setProperty("/Role", aRolesForSolution);
            //} else {
            //    MessageBox.error("Solution with SolId " + sSolId + " not found.");
            //    this.getOwnerComponent().getRouter().navTo("Worklist");
            //}

            //if (oSelectedSolution) {
                this._loadImages(sSolId);
            //} 
        },        

        onNavBack: function () {
            this.getModel("singleSolutionModel").setData({});
            this.getModel("detailView").setData({});

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
            this.getModel("viewSettings").setProperty("/isEditMode", true);
            var oViewModelData = this.getModel("singleSolutionModel").getData();
            this.getModel("detailView").setData(JSON.parse(JSON.stringify(oViewModelData)));
        },     

        onSavePress: function() {
            var oDataModel = this.getModel();
            var oViewDetailData = this.getView().getModel("detailView").getData();
            const sRouteName = this.getModel("viewSettings").getProperty("/currentRoute"); 

            if (sRouteName === "Create"){
                var sPath = "/ZC_BSK_LA_SOLUTION";
                MessageBox.confirm("Are you sure you want to save changes?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function(sAction) {
                        if (sAction === MessageBox.Action.YES) {
                            if(sRouteName === "Create") {
                                oDataModel.create(sPath, oViewDetailData, {
                                    success: function() {
                                        MessageBox.success("Object created successfully.");
                                        this.getModel("viewSettings").setProperty("/isEditMode", false);
                                        this.onNavBack();
                                    }.bind(this),
                                    error: function() {
                                        MessageBox.error("Creation failed.");
                                    }
                                });
                            } 
                        } 
                    }.bind(this)
                });
              } else if (sRouteName === "Detail") {

              }
    },
            //var sMessage = sCurrentRoute === "Create" ? "Czy na pewno chcesz stworzyć ten obiekt?" : "Czy na pewno chcesz edytować ten obiekt?";
            
            //MessageBox.confirm(sMessage, {
            //    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
            //    onClose: function(sAction) {
            //        if (sAction === MessageBox.Action.YES) {
            //            this.onNavBack();
            //        }
            //    }.bind(this)
            //});
        

            //var oDetailData = this.getModel("detailView").getData();
            //var oDataModel = this.getOwnerComponent().getModel();
            //if (this._sSolId) {
            //    var sPath = "/ZC_BSK_LA_SOLUTION('" + this._sSolId + "')";
            //    oDataModel.update(sPath, oDetailData, {
            //        success: function() {
            //            MessageBox.success("Object updated successfully.");
            //            this.getModel("detailView").setProperty("/isEditMode", false);
            //            this._loadData(this._sSolId);
            //        }.bind(this),
            //        error: function() {
            //            MessageBox.error("Update failed.");
            //        }
            //    });
            //} else {
            //    oDataModel.create("/ZC_BSK_LA_SOLUTION", oDetailData, {
            //        success: function() {
            //            MessageBox.success("New object created successfully.");
            //            this.getModel("singleSolutionModel").setProperty("/isEditMode", false);
            //            // mogę zrobić sobie nawigację do tego obiektu - generalnie rozwinąć do batcha
            //            this.getOwnerComponent().getRouter().navTo("Worklist");
            //        }.bind(this),
            //        error: function() {
            //            MessageBox.error("Creation failed.");
            //        }
            //    });
            //}


        onCancelPress: function() {
            this.getModel("viewSettings").setProperty("/isEditMode", false);
            if (this._sSolId) {
                this._loadData(this._sSolId);
            } else {
                this.onNavBack();
            }
        },

        setDefaultValues: function () {
            var oDetailViewModel = this.getModel("detailView");
        
            oDetailViewModel.setProperty("/Status", "1");
            // oDetailViewModel.setProperty("/AnotherField", "DefaultValue");
        
        },

        onStatusChange: function (oEvent) {
            var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
            var oModel = this.getModel("detailView");
            oModel.setProperty("/Status", sSelectedKey);
        },

        onTypeChange: function (oEvent) {
            var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
            var oModel = this.getModel("detailView");
            oModel.setProperty("/SolType", sSelectedKey);
        },

        _loadTargetMappings: function (sSolId) {
                var oModel = this.getModel("odata");
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
            var oModel = this.getModel("jsonModelFile");
            var sPath = "/ZC_BSK_LA_SOLUTION('" + sSolId + "')/to_Service";
            oModel.read(sPath, {
                success: function (oData) {
                },
                error: function (oError) {
                    MessageBox.error("Error during loading Services.");
                }
            });
        },

        _loadImages: function() {
            var oViewDetailData = this.getView().getModel("detailView").getData();
            console.log("Tu jest detailvie", oViewDetailData);
         //   console.log("Tu jest image", this.getView().getModel("detailView").getData().getProperty("/to_Image"));
            
            this.getModel().refresh();
        },


        

        _loadAttachments: function (sSolId) {

        },

        _loadComponents: function (sSolId) {

        },

        _loadRoles: function (sSolId) {

        },

        _loadGroups: function (sSolId) {

        },

        _loadCatalogs: function (sSolId) {

        },

        _loadTiles: function (sSolId) {

        },

        _loadComments: function (sSolId) {

        },

        onDeletePress: function () {
            var oModel = this.getModel();
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
        }
    });
});
