sap.ui.define([
    "sap/ui/core/mvc/Controller",
  ], function (Controller, JSONModel, MessageBox) {
    "use strict";
  
    return Controller.extend("fiorilibappname.controller.Worklist", {
        onInit: function () {
            this._bIsFilterBarInitialized = false;
            var dataModel = this.getOwnerComponent().getModel("tableDataMock");
            console.log(dataModel.getData());
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
        
           //var oViewModel = new JSONModel({
           //  isFilterBarVisible: false,
           //  filterBarLabel: "",
           //  delay: 0,
           //  title: this.getResourceBundle().getText("worklistTitleCount", [0]),
           //  noDataText: this.getResourceBundle().getText("worklistNoDataText"),
           //  sortBy: "TechnicalName",
           //  groupBy: "None"
           //});
            this.getView().setModel(dataModel, "dataModel");
          },
  
      onPress: function (oEvent) {
        var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
        var oBindingContext = oItem.getBindingContext("dataModel");
    
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
        if (sText && sText.length > 300) {
            return sText.substring(0, 300) + '...';
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
  