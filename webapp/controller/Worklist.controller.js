sap.ui.define([
  "fiorilibappname/controller/BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, Filter, FilterOperator) {
  "use strict";

  return BaseController.extend("fiorilibappname.controller.Worklist", {
    onInit: function () {
      var oSmartFilterBar = this.byId("smartFilterBar");
      if (oSmartFilterBar) {
          oSmartFilterBar.attachInitialise(this._onSmartFilterBarInitialised, this);
      }
      this.setModel(new JSONModel(), "global");
      var oViewGlobalModel = this.getOwnerComponent().getModel();
      this.getModel("global").setData(oViewGlobalModel);


      this._oCustomMultiComboBox = this.byId("multiComboBoxStatus");
      
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
      oRouter.attachRouteMatched(function (oEvent) {
        var sRouteName = oEvent.getParameter("name");
        if (sRouteName === "Worklist") {
          this._resetSelection();
        }
      }, this);
    },

    _onSmartFilterBarInitialised: function() {
      var oSmartFilterBar = this.byId("smartFilterBar");
      oSmartFilterBar.search();
    },

    _resetSelection: function () {
      var oTable = this.byId("idSolutionTable");
      if (oTable) {
        oTable.removeSelections(true);
      }
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

    onAddButtonPress: function () {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("Create");
    },

    truncateText: function (sText) {
      if (sText && sText.length > 200) {
        return sText.substring(0, 200) + '...';
      } else {
        return sText;
      }
    },

    onSearch: function (oEvent) {
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

    //onBeforeRebindClaimTable: function (oEvent) {
    //  const oBinding = oEvent.getParameter("bindingParams");
    //  const aFilters = this._getFilters();
    //  aFilters.forEach(filter => oBinding.filters.push(filter));
    //},

    onBeforeRebindTable: function (oEvent) {
      var mBindingParams = oEvent.getParameter("bindingParams"),
          aSelectedSolutions = this._oCustomMultiComboBox.getSelectedKeys();
      var oMultiComboBox = this.getView().byId("multiComboBoxStatus").getSelectedKeys(); // dziala, wyswietla filtry - save - .getSelectedKeys()

      aSelectedSolutions.forEach(function(key) {
				mBindingParams.filters.push(
					new Filter(
						"Status",
						FilterOperator.EQ,
						key
					)
				);
			});




      //var oModel = this.getModel("global");
      //var aStatusFilters = oModel.getProperty("/selectedStatus");
//
      //if (oMultiComboBox.length > 0) {
      //  var aStatusFilters = oMultiComboBox.map(function(key) {
      //      return new Filter("Status", sap.ui.model.FilterOperator.EQ, key);
      //  });
      //  
      //  if(aStatusFilters.length > 0){
      //    var oStatusGroupFilter = new Filter(aStatusFilters, false);
      //    oBindingParams.filters.push(oStatusGroupFilter);
      //  }
      //  
      //}
    },

    _getFilters: function () {
      var aFilters = [];
      var oModel = this.getModel("global");
      var sStatus = oModel.getProperty("/selectedStatus");

      if (sStatus) {
        var oStatusFilter = new sap.ui.model.Filter("StatusDescription", sap.ui.model.FilterOperator.EQ, sStatus);
        aFilters.push(oStatusFilter);
      }
      return aFilters;
    },

    onExit: function () {
			this._oModel.destroy();
			this._oModel = null;
		},

    getResourceBundle: function () {
      return this.getOwnerComponent().getModel("i18n").getResourceBundle();
    }
  });
});
