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

        // Asynchronously load OData model metadata, then read data
        oODataModel.metadataLoaded().then(function() {
            oODataModel.read("/ZC_BSK_LA_SOLUTION", {
                success: function(oData) {
                    var oDataModel = new JSONModel(oData.results);
                    this.getView().setModel(oDataModel, "SolutionsData"); // Assign fetched data to the view model
                    oViewModel.setProperty("/loading", false); // Update loading state
                }.bind(this),
                error: function() {
                    oViewModel.setProperty("/loading", false); // Update loading state on error
                }
            });
        }.bind(this));

          // Initialize router
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
  
    onFilterByRole: function(oEvent) {
        var sQuery = oEvent.getParameter("query").toLowerCase();
        var oTable = this.getView().byId("table1");
        var oBinding = oTable.getBinding("items");
        var oRoleFilter = new sap.ui.model.Filter("to_S_Role", function(oRole) {
            return oRole.some(function(oItem) {
                return oItem.RoleId.toLowerCase().indexOf(sQuery) > -1;
            });
        });
        oBinding.filter([oRoleFilter]);
    },
      
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      }
    });
  });
  