 namespace models;
              using { cuid, managed} from '@sap/cds/common';
entity Order {
	key ID :UUID;
	test5: String @mandatory;
	fld_Order: Association to Customer;
}
entity Customer {
	key ID :UUID;
	test2: String @readonly;
	key test1: String @readonly;
	order : Association to many Order	on order.fld_Order = $self;
	client : Association to Client;
}
entity Product {
	key ID :UUID;
	key test3: String @readonly;
	rr : Association to many rr	on rr.fld_rr = $self;
	clients : Composition of many ProductToClient on clients.product=$self;
}
entity ProductToClient {
              
	key product : Association to Product;
              
	key client : Association to Client;
              
}
entity Client {
	key ID :UUID;
	test4: String @readonly;
	rrs : Composition of many rrToClient on rrs.client=$self;
	products : Composition of many ProductToClient on products.client=$self;
	clientCustomer : Association to Customer;
}
entity rr {
	key ID :UUID;
	fld_rr: Association to Product;
	clients : Composition of many rrToClient on clients.rr=$self;
}
entity rrToClient {
              
	key rr : Association to rr;
              
	key client : Association to Client;
              
}

