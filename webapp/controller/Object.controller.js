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
            var viewModel = this.getOwnerComponent().getModel("viewModel");
            this.getView().setModel(viewModel, "viewModel");
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
            var viewModel = this.getOwnerComponent().getModel("viewModel");
            var oDetailModel = this.getView().getModel("viewDetail");

            let emptyData = {};

            if (sRouteName === "Create") {
                viewModel.setData(emptyData);
                oDetailModel.setData(emptyData); 
                this.getView().getModel("viewDetail").setData(emptyData);
                viewModel.setProperty("/isEditMode", true);
            } else if (sRouteName === "Detail") {
                this._sSolId = oEvent.getParameter("arguments").SolId;
                viewModel.setProperty("/isEditMode", false);
                if (this._sSolId) {
                    this._loadData(this._sSolId);
                } else {
                    viewModel.setProperty("/isEditMode", true);
                    viewModel.setData(emptyData);
                    this.getView().getModel("viewDetail").setData(emptyData);
                }
            }
        },

        onExit: function () {
            this.oRouter.detachRouteMatched(this.onRouteMatched, this);
        },

        _initializeNewSolution: function () {
            var oNewSolutionData = {
                TechnicalName: "",
                Url: "",
                Description: "",
            };
            this.getView().getModel().setData(oNewSolutionData);
        },

        onBeforeNavigate: function (oEvent) {
            var oViewModel = this.getView().getModel("viewModel");
        
            if (!oViewModel.getProperty("/isEditMode")) {
                return;
            }
        
            var oSection = oEvent.getParameter("section");
            oEvent.preventDefault();
        
            if (!this.oDialog) {
                this.oDialog = new Dialog({
                    title: "Unsaved changes",
                    content: new Text({text: "You are in 'Edit' mode. Are you sure you want to navigate to other section?"}),
                    beginButton: new Button({
                        text: "OK",
                        press: function () {
                            this.oDialog.close();
                            this.getView().byId("ObjectPageLayout").setSelectedSection(oSection);
                        }.bind(this)
                    }),
                    endButton: new Button({
                        text: "Cancel",
                        press: function () {
                            this.oDialog.close();
                        }.bind(this)
                    })
                });
        
                this.getView().addDependent(this.oDialog);
            }
        
            this.oDialog.open();
        },

        onNavBack: function () {
            this.selectedGenres = [];
    
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
    
            if (sPreviousHash !== undefined) {
              window.history.go(-1);
            } else {
              var oRouter = this.getOwnerComponent().getRouter();
              oRouter.navTo("Main", {}, true);
            }
          },
        
        _loadData: function (sSolId) {
            var dataModel = this.getOwnerComponent().getModel("viewModel");
            var solutions = dataModel.getProperty("/Solutions");
            var selectedSolution = null;
        
            for (var i = 0; i < solutions.length; i++) {
                if (solutions[i].SolId === sSolId) {
                    selectedSolution = solutions[i];
                    break;
                }
            }
        
            if (selectedSolution) {
                var oViewModel = this.getView().getModel("viewModel");
                var oDetailModel = this.getView().getModel("viewDetail");
                oDetailModel.setData(selectedSolution);
                oViewModel.setData(JSON.parse(JSON.stringify(selectedSolution)));
                this._loadImages(sSolId);
            } else {
                MessageBox.error("Error: Solution with SolId " + sSolId + " not found.");
                // to NotFound view
            }
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
            var oDetailData = this.getView().getModel("viewDetail").getData();
            var oDataModel = this.getOwnerComponent().getModel();
            if (this._sSolId) {
                var sPath = "/ZC_BSK_LA_SOLUTION('" + this._sSolId + "')";
                oDataModel.update(sPath, oDetailData, {
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
                oDataModel.create("/ZC_BSK_LA_SOLUTION", oDetailData, {
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
        },

        onCancelPress: function() {
            this.getOwnerComponent().getModel("viewModel").setProperty("/isEditMode", false);
            if (this._sSolId) {
                this._loadData(this._sSolId);
            } else {
                let emptyData = { TechnicalName: "", Url: "", Description: "" };
                this.getView().getModel("viewDetail").setData(emptyData);
                this.getView().getModel("viewModel").setData(emptyData);
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

        _loadImages: function (sSolId) {
           // var aMediaGalleryLayout = Object.keys(library.MediaGalleryLayout).map(function(key){return {'key': key};}),
			//	aMediaGalleryMenuHorizontalAlign = Object.keys(library.MediaGalleryMenuHorizontalAlign).map(function(key){return {'key': key};}),
			//	aMediaGalleryMenuVerticalAlign = Object.keys(library.MediaGalleryMenuVerticalAlign).map(function(key){return {'key': key};});
//
			//var oImageModel = new JSONModel({
			//	Analytical: sap.ui.require.toUrl("fiorilibappname/images/Analytical.jpg"),
			//	Invoices: sap.ui.require.toUrl("fiorilibappname/images/Invoices.jpg"),
			//	Liquidity: sap.ui.require.toUrl("fiorilibappname/images/Liquidity.jpg"),
			//	Manage_Payment_Blocks: sap.ui.require.toUrl("fiorilibappname/images/Manage_Payment_Blocks.jpg"),
			//	PCItemsByAA: sap.ui.require.toUrl("fiorilibappname/images/PCItemsByAA.jpg"),
			//	reconrep: sap.ui.require.toUrl("fiorilibappname/images/reconrep.png"),
			//	galleryTypes: aMediaGalleryLayout,
			//	horizontalTypes: aMediaGalleryMenuHorizontalAlign,
			//	verticalTypes: aMediaGalleryMenuVerticalAlign,
			//	selectedType : aMediaGalleryLayout[0].key,
			//	selectedHorizontalType : aMediaGalleryMenuHorizontalAlign[0].key,
			//	selectedVerticalType : aMediaGalleryMenuVerticalAlign[0].key,
			//	selectedInteractiveDisplayArea: true,
			//	selectedShowAllThumbnails: false
			//});
//
           // this.getView().setModel(this.oImageModel);
        },

        onSelectType: function (oEvent) {
			this.oModel.setProperty("/selectedType", oEvent.getParameter("selectedItem").getKey());
		},

		onSelectHorizontalType: function (oEvent) {
			this.oModel.setProperty("/selectedHorizontalType", oEvent.getParameter("selectedItem").getKey());
		},

		onSelectVerticalType: function (oEvent) {
			this.oModel.setProperty("/selectedVerticalType", oEvent.getParameter("selectedItem").getKey());
		},

		onInteractiveChange: function (oEvent) {
			this.oModel.setProperty("/selectedInteractiveDisplayArea", oEvent.getParameter('state'));
		},

		onShowAllChange: function (oEvent) {
			this.oModel.setProperty("/selectedShowAllThumbnails", oEvent.getParameter('state'));
		},

		onOverflowClick: function(oEvent) {
			var demoToast = this.getView().byId("demoToast");
			demoToast.setText("Event overflowClick fired.");
			demoToast.show();
		},

		onSelectionChange: function(oEvent) {
			var demoToast = this.getView().byId("demoToast");
			demoToast.setText("Event selectionChange fired.");
			demoToast.show();
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

        _loadAttachments: function (sSolId) {

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
        },

        onNavToDescription: function() {
            var oObjectPageLayout = this.byId("ObjectPageLayout");
            oObjectPageLayout.setSelectedSection(this.getView().byId("descriptionSection"));
        }
    });
});
