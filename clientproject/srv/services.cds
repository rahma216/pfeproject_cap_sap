using models from '../db/models.cds'; 
service modelsService {

	entity Customer as projection on models.Customer;
	entity Client as projection on models.Client;
	entity Order as projection on models.Order;
}

