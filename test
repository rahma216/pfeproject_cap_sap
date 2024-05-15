 namespace models;
      using { cuid, managed} from '@sap/cds/common';
entity Order {
	test5: String @mandatory;
	fld : Association to Customer;
}
entity Customer {
	key test1: String @readonly;
	test2: String @readonly;
	order : Association to many Order	on order.fld = $self;
	client : Association to Client;
}
entity Product {
	key test3: String @readonly;
	clients : Composition of many ProductToClient on clients.product=$self;
}
entity ProductToClient {
      
	key product : Association to Product;
      
	key client : Association to Client;
      
}
entity Client {
	test4: String @readonly;
	products : Composition of many ProductToClient on products.client=$self;
	clientCustomer : Association to Customer;
}

