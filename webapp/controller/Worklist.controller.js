sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel"
  ], function (Controller, JSONModel, ODataModel) {
    "use strict";
  
    return Controller.extend("fiorilibappname.controller.Worklist", {
      onInit: function () {
          this.getView().setModel(new JSONModel(), "global");
          var oViewGlobalModel = this.getOwnerComponent().getModel();
          this.getView().getModel("global").setData(oViewGlobalModel);


          var oRouter = this.getOwnerComponent().getRouter();
          oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
      },
  
      onPress: function (oEvent) {
        var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
        var oBindingContext = oItem.getBindingContext();
    
        if (!oBindingContext) {
            MessageBox.error("Binding context not found.");
            return;
        }
    
        var sSolId = oBindingContext.getProperty("SolId");
        var oRouter = this.getOwnerComponent().getRouter();
        this.getOwnerComponent().getRouter().navTo("Detail", {
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

      onSearchRole: function(oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
        var oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([oFilter]);
      },


      onSearchTile: function(oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
        var oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([oFilter]);
      },

      onSearchGroup: function(oEvent) {
        var sValue = oEvent.getParameter("value");
        var oFilter = new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
        var oBinding = oEvent.getSource().getBinding("items");
        oBinding.filter([oFilter]);
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

      onBeforeRebindClaimTable: function (oEvent) { 
          const oBinding = oEvent.getParameter("bindingParams");
          const aFilters =  this._getFilters();
          aFilters.forEach(filter => oBinding.filters.push(filter));
      },

      _getFilters: function() {
        var oFilter1 = new sap.ui.model.Filter("", sap.ui.model.FilterOperator.EQ, "Val");
        
      },


      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      }
    });
  });
  