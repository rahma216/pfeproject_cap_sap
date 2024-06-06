sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'projet2/projet2/test/integration/FirstJourney',
		'projet2/projet2/test/integration/pages/CustomerList',
		'projet2/projet2/test/integration/pages/CustomerObjectPage'
    ],
    function(JourneyRunner, opaJourney, CustomerList, CustomerObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('projet2/projet2') + '/index.html'
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