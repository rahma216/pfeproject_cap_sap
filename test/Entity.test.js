const cds = require('@sap/cds');
 
 
 
// Initialize the CDS test environment to use service configurations
const test = cds.test(__dirname + '/..');
 
 
let draftId, incidentId;
 
 
describe('Model Service Test Suite', () => {
  let modelService;
 
  beforeAll(async () => {
    // Connect to the specific model service as defined in the srv folder
    modelService = await cds.connect.to('modelsService');
  });
 
  it('Should fetch all Entities and expect a specific number', async () => {
    const { Entity } = modelService.entities;
    const entities = await SELECT.from(Entity);
    // Adjust the expected number as per your test data or expected results
    expect(entities.length).toBeGreaterThan(0); // Example check for non-empty result
  });
 
  it('Should fetch all Fields linked to an Entity and check properties', async () => {
    const { Field } = modelService.entities;
    const fields = await SELECT.from(Field).where({ type: 'string' }); // Example to filter by type
    fields.forEach(field => {
      expect(field.type).toBe('string'); // Checking if all fetched fields are of type 'string'
      expect(field).toHaveProperty('value');
    });
  });
  it('should create an entity', async () => {
    const dataToCreate = { ID: "11", name: "test entity" };
 
    const created = await modelService.create('Entity').entries(dataToCreate);
 
    expect(created.ID).toBeDefined();
    expect(created.name).toEqual('test entity');
  });
  it('should delete an entity', async () => {
    const dataToDelete = { ID: "11" }; // Assuming 'ID' is the primary key for entity identification
    const deleteResponse = await modelService.delete('Entity').where(dataToDelete);
 
    // Assert to check if the deletion was successful, adjust depending on the response structure
    expect(deleteResponse).toEqual(1); // Example response check, may need adjustment based on actual response
 
    // Optionally, verify that the entity is no longer present
    const fetchDeleted = await modelService.read('Entity').where(dataToDelete);
    expect(fetchDeleted.length).toBe(0);
  });
  it('should update an entity', async () => {
    const originalData = { ID: "4", name: "initial name" };
    const updateData = { name: "updated name" };
 
    // Assuming the entity is already created, if not, you should create it as part of setup or in a separate test
   // await modelService.create('Entity').entries(originalData);
 
    // Perform the update
    const updateResponse = await modelService.update('Entity').set(updateData).where({ ID: "4" });
 
    // Optionally check the response of the update operation, if it provides such data
    expect(updateResponse).toEqual({ ID: "4", name: "updated name" });
 
    // Fetch the updated entity to verify changes
    const updatedEntity = await modelService.read('Entity').where({ ID: "4" });
    expect(updatedEntity[0].name).toEqual("updated name");
  });
  it('should create a field with entity reference with id 700', async () => {
    // Assurez-vous que l'entité référencée existe
    const orderData = {
        ID: "6", // Assurez-vous que cet ID est unique et conforme à vos contraintes de base de données
        name: "Sample Ordemmmmr"
    };
 
    // Créez l'entité Order
   // const orderCreated = await modelService.create('Entity', orderData);
 
    // Données à créer pour Field, avec référence à l'entité créée
    const fieldData = {
        ID: "700",
        value: "test field",
        type: "String",
        fld:{ ID: "4" },
        annotations: "@readonly",
        iskey: false
    };
 
    // Création de l'entité Field avec référence
    const fieldCreated = await modelService.create('Field',fieldData);
 
    // Vérifications des propriétés de l'objet créé
    expect(fieldCreated.ID).toBeDefined();
    expect(fieldCreated.value).toBe('test field');
    expect(fieldCreated.type).toBe('String');
    expect(fieldCreated.annotations).toBe('@readonly');
    expect(fieldCreated.iskey).toBe(false);
});
it('should update a field', async () => {
  const updateData = { value: "updated value" };
 
  // Assuming the entity is already created, if not, you should create it as part of setup or in a separate test
 // await modelService.create('Entity').entries(originalData);
 
  // Perform the update
  const updateResponse = await modelService.update('Field').set(updateData).where({ ID: "700" });
 
  // Optionally check the response of the update operation, if it provides such data
  expect(updateResponse).toEqual({ ID: "700", value: "updated value" });
 
  // Fetch the updated entity to verify changes
  const updatedEntity = await modelService.read('Field').where({ ID: "700" });
  expect(updatedEntity[0].value).toEqual("updated value");
});
it('should delete a field', async () => {
  const dataToDelete = { ID: "700" }; // Assuming 'ID' is the primary key for entity identification
  const deleteResponse = await modelService.delete('Field').where(dataToDelete);
 
  // Assert to check if the deletion was successful, adjust depending on the response structure
  expect(deleteResponse).toEqual(1); // Example response check, may need adjustment based on actual response
 
  // Optionally, verify that the entity is no longer present
  const fetchDeleted = await modelService.read('Field').where(dataToDelete);
  expect(fetchDeleted.length).toBe(0);
});

 
 
 
 
 
 
});