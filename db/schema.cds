namespace models;
using { cuid, managed} from '@sap/cds/common';
entity Association :cuid, managed{
  entitySource : Association to Entity;
  entityTarget  : Association to Entity;
  type : String;

}
entity Entity : cuid, managed {
    key ID       : String;
    name        : String;
    fields      : Association to many Field on fields.fld = $self;
}
entity Field : cuid, managed {
    key ID       : String;
    value       : String;
    type        : String;
    fld         : Association to Entity; // Many-to-one association
    annotations : String ;
    iskey       : Boolean;
}