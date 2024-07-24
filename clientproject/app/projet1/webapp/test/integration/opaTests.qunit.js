sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'projet1/projet1/test/integration/FirstJourney',
		'projet1/projet1/test/integration/pages/CustomerList',
		'projet1/projet1/test/integration/pages/CustomerObjectPage'
    ],
    function(JourneyRunner, opaJourney, CustomerList, CustomerObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('projet1/projet1') + '/index.html'
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