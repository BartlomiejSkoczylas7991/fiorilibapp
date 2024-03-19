sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'sap/ui/webc/fiori/library'
], function (Controller, History, DateFormat, JSONModel, MessageBox, library) {
    "use strict";

    return Controller.extend("fiorilibappname.controller.Object", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
            oRouter.getRoute("Create").attachPatternMatched(this._onObjectMatched, this);
        
            this.getView().setModel(new JSONModel(), "singleSolutionModel");
            this.getView().setModel(new JSONModel(), "detailView");
        
            this._dateFormatter = DateFormat.getDateInstance({
                pattern: "dd.MM.yyyy",
            });
        },

        _onObjectMatched: function (oEvent) {
            var oViewGlobalModel = this.getView().getModel("viewGlobal");
            var oSingleSolutionModel = this.getView().getModel("singleSolutionModel");
            var oDetailModel = this.getView().getModel("detailView");
            var sSolId = oEvent.getParameter("arguments").SolId;

            var oObjectPageLayout = this.getView().byId("ObjectPageLayout");
            if (oObjectPageLayout) {
                var oFirstSection = oObjectPageLayout.getSections()[0]; 
                if (oFirstSection) {
                    oObjectPageLayout.setSelectedSection(oFirstSection.getId());
                }
            }
            
            const sRouteName = oEvent.getParameter("name");
            oViewGlobalModel.setProperty("/currentRoute", sRouteName);
            if (sRouteName === "Create") {
                oDetailModel.setData({}); 
                oViewGlobalModel.setProperty("/isEditMode", true);
                oSingleSolutionModel.setData({});
                oDetailModel.setData({});
            } else if (sRouteName === "Detail") {
                oViewGlobalModel.setProperty("/isEditMode", false);
                if (sSolId) {
                    this._loadData(sSolId);
                } else {
                    // navigation to error
                }
            }
        },

        onExit: function () {
            this.oRouter.detachRouteMatched(this.onRouteMatched, this);
        },

        onBeforeNavigate: function (oEvent) {
            var oGlobalModel = this.getView().getModel("viewGlobal");
        
            if (!oGlobalModel.getProperty("/isEditMode")) {
                return;
            };
        },
        
        _loadData: function (sSolId) {
            var oGlobalModel = this.getOwnerComponent().getModel("viewGlobal");
            var aSolutions = oGlobalModel.getProperty("/Solutions");
            var oSelectedSolution = aSolutions.find(solution => solution.SolId === sSolId);
            this._sSolId = sSolId; 
            if (oSelectedSolution) {
                this.getView().getModel("singleSolutionModel").setData(oSelectedSolution);
                this.getView().getModel("detailView").setData(jQuery.extend(true, {}, oSelectedSolution));
                    
                var aRolesForSolution = oSelectedSolution.to_S_Role.map(role => {
                    return oGlobalModel.getProperty("/Role").find(r => r.RoleId === role.RoleId);
                }).filter(role => role);

                var oRoleModelEdit = new JSONModel({to_S_Role: aRolesForSolution});
                this.getView().setModel(oRoleModelEdit, "roleModelEdit");

                this.getView().getModel("singleSolutionModel").setProperty("/Role", aRolesForSolution);
            } else {
                MessageBox.error("Solution with SolId " + sSolId + " not found.");
                this.getOwnerComponent().getRouter().navTo("Worklist");
            }

            if (oSelectedSolution) {
                this._loadImages(sSolId);
            } 
        },        

        onNavBack: function () {
            this.getView().getModel("singleSolutionModel").setData({});
            this.getView().getModel("detailView").setData({});

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
            this.getView().getModel("viewGlobal").setProperty("/isEditMode", true);
            var oViewModelData = this.getView().getModel("singleSolutionModel").getData();
            this.getView().getModel("detailView").setData(JSON.parse(JSON.stringify(oViewModelData)));
        },     

        onSavePress: function() {
            var oViewGlobalModel = this.getView().getModel("viewGlobal");
            var sCurrentRoute = oViewGlobalModel.getProperty("/currentRoute");
            var sMessage = sCurrentRoute === "Create" ? "Czy na pewno chcesz stworzyć ten obiekt?" : "Czy na pewno chcesz edytować ten obiekt?";
            
            MessageBox.confirm(sMessage, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function(sAction) {
                    if (sAction === MessageBox.Action.YES) {
                        this.onNavBack();
                    }
                }.bind(this)
            });
        },

            //var oDetailData = this.getView().getModel("detailView").getData();
            //var oDataModel = this.getOwnerComponent().getModel();
            //if (this._sSolId) {
            //    var sPath = "/ZC_BSK_LA_SOLUTION('" + this._sSolId + "')";
            //    oDataModel.update(sPath, oDetailData, {
            //        success: function() {
            //            MessageBox.success("Object updated successfully.");
            //            this.getView().getModel("detailView").setProperty("/isEditMode", false);
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
            //            this.getView().getModel("singleSolutionModel").setProperty("/isEditMode", false);
            //            // mogę zrobić sobie nawigację do tego obiektu - generalnie rozwinąć do batcha
            //            this.getOwnerComponent().getRouter().navTo("Worklist");
            //        }.bind(this),
            //        error: function() {
            //            MessageBox.error("Creation failed.");
            //        }
            //    });
            //}


        onCancelPress: function() {
            this.getOwnerComponent().getModel("viewGlobal").setProperty("/isEditMode", false);
            if (this._sSolId) {
                this._loadData(this._sSolId);
            } else {
                this.getView().getModel("detailView").setData({});
                this.getView().getModel("singleSolutionModel").setData({});
            }
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
            var oModel = this.getView().getModel("jsonModelFile");
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
            var oDetailModel = this.getView().getModel("singleSolutionModel");
            var images = oDetailModel.getProperty("/Images") || [];
            var imagePaths = images.map(function(img) {
                return {src: sap.ui.require.toUrl("fiorilibappname/images" + img.src)};
            });
            var oImageModel = new sap.ui.model.json.JSONModel({
                Images: imagePaths
            });
            this.getView().setModel(oImageModel, "imageModel");
            this.getView().getModel().refresh();
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
    });
});
