sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
    "use strict";

    return Controller.extend("example.Description", {

        onInit: function() {
            var viewModel = this.getView().getModel();
            var description = viewModel.getProperty("/Description");
        }

    });
});