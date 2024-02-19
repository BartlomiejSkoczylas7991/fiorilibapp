sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
  ], function (Controller, History, JSONModel, Filter, FilterOperator, MessageBox) {
    "use strict";
  
    return Controller.extend("fiorilibappname.controller.Worklist", {
        onInit: function () {
            this._bIsFilterBarInitialized = false;
            var oModel = this.getOwnerComponent().getModel();
            console.log(oModel);
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
        
            var oViewModel = new JSONModel({
              isFilterBarVisible: false,
              filterBarLabel: "",
              delay: 0,
              title: this.getResourceBundle().getText("worklistTitleCount", [0]),
              noDataText: this.getResourceBundle().getText("worklistNoDataText"),
              sortBy: "TechnicalName",
              groupBy: "None"
            });
            this.getView().setModel(oViewModel, "worklistView");
          },
  
      onPress: function (oEvent) {
        var oItem = oEvent.getParameter("listItem") || oEvent.getParameter("row");
        var oBindingContext = oItem.getBindingContext();
        console.log(oBindingContext); 
    
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

      onAddButtonPress: function () {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("Create");
      },
  
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      }
    });
  });
  