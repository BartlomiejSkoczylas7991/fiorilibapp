sap.ui.define([
    "sap/ui/core/util/MockServer"
], (MockServer) => {
    "use strict";

    return {
        init: function () {
            // create
            const oMockServer = new MockServer({
                rootUri: "/sap/opu/odata/sap/ZBSK_LA_SOL;v=2/"
            });

            const oUrlParams = new URLSearchParams(window.location.search);

			// configure mock server with a delay
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: oUrlParams.get("serverDelay") || 999
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