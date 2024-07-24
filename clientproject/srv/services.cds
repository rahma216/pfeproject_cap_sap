using models from '../db/models.cds'; 
service modelsService {

	 entity Customer as projection on models.Customer;
	@insertonly entity Payment as projection on models.Payment;
	@cds.persistence.skip entity Invoice as projection on models.Invoice;
	@cds.persistence.exists entity Client as projection on models.Client;
	 entity Product as projection on models.Product;
	@cds.persistence.skip entity Order as projection on models.Order;
}
