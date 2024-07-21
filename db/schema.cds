namespace models;
using { cuid, managed} from '@sap/cds/common';

entity Files {
  key ID: UUID;
  name: String;
  size: Integer;
  type: String;
  content: LargeBinary;
}


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
    annotations : String;
    fields      : Association to many Field on fields.fld = $self;
   
}
entity Association :cuid, managed{
      key ID       : UUID;
  entitySource : Association to Entity;
  entityTarget  : Association to Entity;
  type : String;


}
type FieldType : String enum{
    String   = 'String';
    Integer  = 'Integer';
    Decimal  = 'Decimal';
    Boolean  = 'Boolean';
    Date     = 'Date';
    Time     = 'Time';
    DateTime = 'DateTime';
    Binary   = 'Binary';
}