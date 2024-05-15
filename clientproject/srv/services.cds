using models from '../db/models.cds'; 
service modelsService {

	entity Customer as projection on models.Customer;
	entity Order as projection on models.Order;
	entity oo as projection on models.oo;
}
