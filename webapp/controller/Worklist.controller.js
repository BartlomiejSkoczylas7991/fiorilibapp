sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel"
  ], function (Controller, JSONModel, ODataModel) {
    "use strict";
  
    return Controller.extend("fiorilibappname.controller.Worklist", {
      onInit: function () {
        var sUri = "/sap/opu/odata/sap/ZBSK_LA_SOL/";
        var oViewModel = new JSONModel({ loading: true });
        this.getView().setModel(oViewModel, "viewModel");

        var oODataModel = new ODataModel(sUri, {
            json: true,
            loadMetadataAsync: true
        });
        this.getView().setModel(oODataModel, "oBindedModel");


        oODataModel.metadataLoaded().then(function() {
            oODataModel.read("/ZC_BSK_LA_SOLUTION", {
                success: function(oData) {
                    var oDataModel = new JSONModel(oData.results);
                    this.getView().setModel(oDataModel, "SolutionsData");
                    oViewModel.setProperty("/loading", false); 
                    var oSmartTable = this.byId("idSmartSolutionTable");
                    if (oSmartTable) {
                        oSmartTable.rebindTable();
        }
                }.bind(this),
                error: function() {
                    oViewModel.setProperty("/loading", false); 
                }
            });
        }.bind(this));

          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
      },
  
      onPress: function (oEvent) {
        var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
        var oBindingContext = oItem.getBindingContext();
    
        if (!oBindingContext) {
            MessageBox.error("Nie znaleziono kontekstu wiązania.");
            return;
        }
    
        var sSolId = oBindingContext.getProperty("SolId");
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Detail", {
            SolId: sSolId
            });
        },
  
      onBeforeExport: function (oEvt) {
        var mExportSettings = oEvt.getParameter("exportSettings");
  
        if (!mExportSettings.url) {
          mExportSettings.worker = false;
        }
      },
      
      _onObjectMatched: function (oEvent) {
        var sSolId = oEvent.getParameter("arguments").solId;
      },

      onAddButtonPress: function() {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Create");
      },    

      truncateText: function(sText) {
        if (sText && sText.length > 200) {
            return sText.substring(0, 200) + '...';
        } else {
            return sText;
        }
      },

      onSearch: function(oEvent) {
        var sQuery = oEvent.getParameter("query");
        var oTable = this.byId("table1");
        var oBinding = oTable.getBinding("items");
        if (sQuery) {
            var oFilter = new sap.ui.model.Filter([
                new sap.ui.model.Filter("TechnicalName", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("Subtitle", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sQuery),
                new sap.ui.model.Filter("StatusDescription", sap.ui.model.FilterOperator.Contains, sQuery)
            ], false);
            oBinding.filter([oFilter]);
        } else {
            oBinding.filter([]);
        }
     },

     onFilterByGroup: function(oEvent) {
      var sQuery = oEvent.getParameter("query").toLowerCase();
      var oTable = this.getView().byId("table1");
      var oBinding = oTable.getBinding("items");
      var oGroupFilter = new sap.ui.model.Filter("to_S_Group", function(oGroup) {
          return oGroup.some(function(oItem) {
              return oItem.GroupId.toLowerCase().indexOf(sQuery) > -1;
          });
      });
      oBinding.filter([oGroupFilter]);
    },
    // Role
      onRoleDialogOpen: function() {
        var oView = this.getView();
        if (!this.byId("roleSelectDialog")) {
            sap.ui.core.Fragment.load({
                id: oView.getId(),
                name: "fiorilibappname.view.RoleDialog",
                controller: this
            }).then(function(oDialog){
                oView.addDependent(oDialog);
                oDialog.open();
            });
           } else {
               this.byId("roleSelectDialog").open();
        }
      },

      onSearchRole: function(oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
        var oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([oFilter]);
      },

      onDialogCloseRole: function(oEvent) {
         var oSelectedItem = oEvent.getParameter("selectedItem");
         if (oSelectedItem) {
             var oViewModel = this.getView().getModel("viewModel");
             oViewModel.setProperty("/selectedRole", oSelectedItem.getTitle());

             sap.m.MessageToast.show("Selected Role: " + oSelectedItem.getTitle());
         } else {
             sap.m.MessageToast.show("No role selected");
         }
      },
      // Tile
      onTileDialogOpen: function() {
        var oView = this.getView();
        if (!this.byId("tileSelectDialog")) {
            sap.ui.core.Fragment.load({
                id: oView.getId(),
                name: "fiorilibappname.view.TileDialog",
                controller: this
            }).then(function(oDialog){
                oView.addDependent(oDialog);
                oDialog.open();
            });
           } else {
               this.byId("tileSelectDialog").open();
        }
      },

      onSearchTile: function(oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
        var oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([oFilter]);
      },

      onDialogCloseTile: function(oEvent) {
         var oSelectedItem = oEvent.getParameter("selectedItem");
         if (oSelectedItem) {
             var oViewModel = this.getView().getModel("viewModel");
             oViewModel.setProperty("/selectedTile", oSelectedItem.getTitle());

             sap.m.MessageToast.show("Selected Tile: " + oSelectedItem.getTitle());
         } else {
             sap.m.MessageToast.show("No tile selected");
         }
      },
      
      // group
      onGroupDialogOpen: function() {
        var oView = this.getView();
        if (!this.byId("groupSelectDialog")) {
            sap.ui.core.Fragment.load({
                id: oView.getId(),
                name: "fiorilibappname.view.GroupDialog",
                controller: this
            }).then(function(oDialog){
                oView.addDependent(oDialog);
                oDialog.open();
            });
           } else {
               this.byId("groupSelectDialog").open();
        }
      },

      onSearchGroup: function(oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
        var oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([oFilter]);
      },

      onDialogCloseGroup: function(oEvent) {
         var oSelectedItem = oEvent.getParameter("selectedItem");
         if (oSelectedItem) {
             var oViewModel = this.getView().getModel("viewModel");
             oViewModel.setProperty("/selectedGroup", oSelectedItem.getTitle());

             sap.m.MessageToast.show("Selected Group: " + oSelectedItem.getTitle());
         } else {
             sap.m.MessageToast.show("No group selected");
         }
      },

      // catalog
      onCatalogDialogOpen: function() {
        var oView = this.getView();
        if (!this.byId("catalogSelectDialog")) {
            sap.ui.core.Fragment.load({
                id: oView.getId(),
                name: "fiorilibappname.view.CatalogDialog",
                controller: this
            }).then(function(oDialog){
                oView.addDependent(oDialog);
                oDialog.open();
            });
           } else {
               this.byId("catalogSelectDialog").open();
        }
      },

      onSearchCatalog: function(oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
        var oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([oFilter]);
      },

      onDialogCloseCatalog: function(oEvent) {
         var oSelectedItem = oEvent.getParameter("selectedItem");
         if (oSelectedItem) {
             var oViewModel = this.getView().getModel("viewModel");
             oViewModel.setProperty("/selectedCatalog", oSelectedItem.getTitle());

             sap.m.MessageToast.show("Selected Catalog: " + oSelectedItem.getTitle());
         } else {
             sap.m.MessageToast.show("No catalog selected");
         }
      },

      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      }
    });
  });
  