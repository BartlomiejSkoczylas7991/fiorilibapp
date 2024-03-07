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
      
      getResourceBundle: function () {
        return this.getOwnerComponent().getModel("i18n").getResourceBundle();
      }
    });
  });
  