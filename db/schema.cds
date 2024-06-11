namespace models;
using { cuid, managed} from '@sap/cds/common';


entity Field : cuid, managed {
    key ID       : UUID;
    value       : String;
    type        : String;
    fld         : Association to Entity; // Many-to-one association
    annotations : String ;
    iskey       : Boolean;
}
entity Entity : cuid, managed {
    key ID       : String;
    name        : String;
    fields      : Association to many Field on fields.fld = $self;
    associations      : Association to many Association on associations.asn = $self;
}
entity Association :cuid, managed{
      key ID       : UUID;
  entitySource : Association to Entity;
  entityTarget  : Association to Entity;
  type : String;
  asn : Association to Entity;

}