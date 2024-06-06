sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'projet1.projet1',
            componentId: 'test1ObjectPage',
            contextPath: '/test1'
        },
        CustomPageDefinitions
    );
});