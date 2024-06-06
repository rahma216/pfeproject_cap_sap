sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'projet1/projet1/test/integration/FirstJourney',
		'projet1/projet1/test/integration/pages/test1List',
		'projet1/projet1/test/integration/pages/test1ObjectPage'
    ],
    function(JourneyRunner, opaJourney, test1List, test1ObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('projet1/projet1') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThetest1List: test1List,
					onThetest1ObjectPage: test1ObjectPage
                }
            },
            opaJourney.run
        );
    }
);