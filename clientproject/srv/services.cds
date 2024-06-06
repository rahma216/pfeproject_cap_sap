using models from '../db/models.cds'; 
service modelsService {

	entity Customer as projection on models.Customer;
	entity Product as projection on models.Product;
	entity Client as projection on models.Client;
	entity test1 as projection on models.test1;
	entity Order as projection on models.Order;
}
