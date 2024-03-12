sap.ui.define([
    "sap/ui/core/util/MockServer"
], (MockServer) => {
    "use strict";

    return {
        init: function () {
            // create
            const oMockServer = new MockServer({
                rootUri: "https://a4m.c4b.sapfioneer.com:44300/sap/opu/odata/sap/ZBSK_LA_SOL;v=2/"
            });

            // simulate
            oMockServer.simulate("../localService/metadata.xml", {
                sMockdataBaseUrl: "../localService/mockdata",
                bGenerateMissingMockData: true
            });
            // const sPath = sap.ui.require.toUrl("fiorilibappname/localService");
            // oMockServer.simulate(sPath + "/metadata.xml", sPath + "/mockdata");

            // start
            oMockServer.start();
        }
    }
})