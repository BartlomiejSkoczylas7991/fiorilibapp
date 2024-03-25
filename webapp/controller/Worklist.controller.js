sap.ui.define([
  "fiorilibappname/controller/BaseController",
  "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
  "use strict";

  return Controller.extend("fiorilibappname.controller.Worklist", {
    onInit: function () {
      this.setModel(new JSONModel(), "global");
      var oViewGlobalModel = this.getOwnerComponent().getModel();
      this.getModel("global").setData(oViewGlobalModel);


      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);

      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
      oRouter.attachRouteMatched(function (oEvent) {
        var sRouteName = oEvent.getParameter("name");
        if (sRouteName === "Worklist") {
          this._resetSelection();
        }
      }, this);
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
      var oBindingParams = oEvent.getParameter("bindingParams");
      var oModel = this.getModel("global");
      var aStatusFilters = oModel.getProperty("/selectedStatus");

      if (aStatusFilters) {
        oBindingParams.filters.push(new sap.ui.model.Filter({
          filters: aStatusFilters,
          and: false
        }));
      }
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
    },

    onStatusSelectionChange: function (oEvent) {
      var aSelectedItems = oEvent.getParameter("selectedItems");
      var aFilters = [];

      aSelectedItems.forEach(function (item) {
        aFilters.push(new sap.ui.model.Filter("StatusDescription", sap.ui.model.FilterOperator.EQ, item.getKey()));
      });

      var oGlobalModel = this.getModel("global");
      oGlobalModel.setProperty("/selectedStatus", aFilters);

      this.byId("idSmartSolutionTable").rebindTable();
    }
  });
});
