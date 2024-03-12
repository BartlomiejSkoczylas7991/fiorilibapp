sap.ui.define([
    "fiorilibappname/localService/mockServer"
], function (mockserver) {
    "use strict";
    // initialize the mock server

    mockserver.init();

    sap.ui.require(["sap/ui/core/ComponentSupport"]);
});