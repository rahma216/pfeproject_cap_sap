const { describe, it, before } = require('mocha'); // Import Mocha functions

const chai = require('chai'); // Import Chai assertion library

const chaiHttp = require('chai-http'); // Import Chai HTTP plugin

const cds = require('@sap/cds');


// Configure chai
chai.use(chaiHttp);
chai.should();

let app = null;

before(async () => {
    // Set up any necessary test environment before running tests
    await cds.deploy(__dirname + '/db').to('sqlite::memory:');
    await cds.serve('modelsService').from(__dirname + '/srv').in('test');
    app = await cds.connect.to('modelsService');
});

describe("Customer Service", () => {
    describe("POST /customers", () => {
        it("should create a new customer", (done) => {
            const newCustomer = {
                test1: "Test Value 1",
                test2: "Test Value 2"
                // Add additional properties as needed
            };

            chai.request(app)
                .post("/customers")
                .send(newCustomer)
                .end((error, response) => {
                    try {
                        response.should.have.status(201); // Assuming 201 is the status code for successful creation
                        response.body.should.be.an("object");
                        // Add assertions to validate the response body if needed
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
        });
    });
});
