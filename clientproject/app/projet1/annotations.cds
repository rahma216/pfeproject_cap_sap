using modelsService as service from '../../srv/services';annotate service.Customer with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'CustomerPhone',
                Value : CustomerPhone,
            },
            {
                $Type : 'UI.DataField',
                Label : 'CustomerName',
                Value : CustomerName,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'CustomerPhone',
            Value : CustomerPhone,
        },
        {
            $Type : 'UI.DataField',
            Label : 'CustomerName',
            Value : CustomerName,
        },
    ],
);
