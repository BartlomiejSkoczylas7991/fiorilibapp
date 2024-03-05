sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function(BaseController) {
  "use strict";

  return BaseController.extend("fiorilibappname.controller.App", {
      onInit: function() {
      },

      onAfterRendering: function() {
          var oElement = this.getView().$();
          while (oElement && oElement.hasClass) {
              if (oElement.hasClass("sapUShellApplicationContainerLimitedWidth")) {
                  oElement.removeClass("sapUShellApplicationContainerLimitedWidth");
                  break;
              }
              oElement = oElement.parent();
          }
      }

  });
});
