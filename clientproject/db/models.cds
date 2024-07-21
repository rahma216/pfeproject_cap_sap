 namespace models;
              using { cuid, managed} from '@sap/cds/common';
entity Order {
	key ID :UUID;
	Status: String @mandatory;
	OrderTotal: Decimal @readonly;
	OrderNumber: String @readonly;
	OrderDate: DateTime @readonly;
	fld_Order: Association to Customer;
}
entity Customer {
	key ID :UUID;
	CustomerEmail: String @readonly;
	CustomerName: String @readonly;
	CustomerPhone: String @mandatory;
	CustomerAddress: String @readonly;
	order : Association to many Order	on order.fld_Order = $self;
	client : Association to Client;
}
entity Product {
	key ID :UUID;
	Price: Decimal @readonly;
	ProductID: String @readonly;
	ProductName: String @readonly;
	Category: String @mandatory;
	Description: String @readonly;
	clients : Composition of many ProductToClient on clients.product=$self;
}
entity ProductToClient {
              
	key product : Association to Product;
              
	key client : Association to Client;
              
}
entity Client {
	key ID :UUID;
	ClientName: String @readonly;
	ClientPhone: String @mandatory;
	ClientEmail: String @readonly;
	ClientAddress: String @readonly;
	products : Composition of many ProductToClient on products.client=$self;
	clientCustomer : Association to Customer;
}
entity Invoice {
	key ID :UUID;
	TotalAmount: Decimal @readonly;
	InvoiceNumber: String @readonly;
	InvoiceDate: DateTime @readonly;
}
entity Payment {
	key ID :UUID;
	PaymentDate: DateTime @readonly;
	AmountPaid: Decimal @readonly;
}
entity Shipment {
	key ID :UUID;
	ShipmentDate: DateTime @readonly;
	Status: String @readonly;
}

