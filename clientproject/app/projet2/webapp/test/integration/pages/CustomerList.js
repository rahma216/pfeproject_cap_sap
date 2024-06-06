sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'projet2.projet2',
            componentId: 'CustomerList',
            contextPath: '/Customer'
        },
        CustomPageDefinitions
    );
});