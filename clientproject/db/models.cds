 namespace models;
              using { cuid, managed} from '@sap/cds/common';
entity Order {
	key ID :UUID;
	test5: String @mandatory;
	fld_Order: Association to Customer;
}
entity Customer {
	key ID :UUID;
	key test1: String @readonly;
	test2: String @readonly;
	order : Association to many Order	on order.fld_Order = $self;
	client : Association to Client;
}
entity Product {
	key ID :UUID;
	key test3: String @readonly;
	clients : Composition of many ProductToClient on clients.product=$self;
}
entity ProductToClient {
              
	key product : Association to Product;
              
	key client : Association to Client;
              
}
entity Client {
	key ID :UUID;
	test4: String @readonly;
	products : Composition of many ProductToClient on products.client=$self;
	clientCustomer : Association to Customer;
}
entity tak {
	key ID :UUID;
}

