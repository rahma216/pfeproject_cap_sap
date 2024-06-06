sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'projet.projet',
            componentId: 'test1ObjectPage',
            contextPath: '/test1'
        },
        CustomPageDefinitions
    );
});