sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'rtgtegb/tree/test/integration/FirstJourney',
		'rtgtegb/tree/test/integration/pages/CustomerList',
		'rtgtegb/tree/test/integration/pages/CustomerObjectPage'
    ],
    function(JourneyRunner, opaJourney, CustomerList, CustomerObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('rtgtegb/tree') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheCustomerList: CustomerList,
					onTheCustomerObjectPage: CustomerObjectPage
                }
            },
            opaJourney.run
        );
    }
);