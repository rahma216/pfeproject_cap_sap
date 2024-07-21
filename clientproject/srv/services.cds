using models from '../db/models.cds'; 
service modelsService {

	 entity Customer as projection on models.Customer;
	@cds.persistence.exists entity Client as projection on models.Client;
	 entity Payment as projection on models.Payment;
	@insertonly entity Product as projection on models.Product;
	@readonly entity Order as projection on models.Order;
}
