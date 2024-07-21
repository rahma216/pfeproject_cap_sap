using models from '../db/schema';

service modelsService {

  entity Entity as projection on models.Entity;

  entity Association   as projection on models.Association;
  entity Field       as projection on models.Field;
    entity Files       as projection on models.Files;
   action saveFile(content: String, path: String) returns String;

 
 
  action uploadFile(file: Binary) returns String;
action downloadZip() returns String;

  action appendTextToFile(content : String)              returns {
    success : Boolean
  };
    action appendCSVToFile(content : String)              returns {
    success : Boolean
  };

  action ExecuteCommand(command : String);

  action appendServiceToFile(content : String)           returns {
    success : Boolean
  };

  action appendUIToFile(content : String, path : String) returns {
    success : Boolean
  };


}
