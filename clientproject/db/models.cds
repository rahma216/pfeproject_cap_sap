namespace models;
using { cuid, managed} from '@sap/cds/common';
entity Order {
	key ID :UUID;
	OrderNumber: String @readonly;
	OrderDate: DateTime @readonly;
	OrderTotal: Decimal @readonly;
	Status: String @mandatory;
	fld_OrderCustomer : Association to Customer;
}
entity Customer {
	key ID :UUID;
	CustomerPhone: String @mandatory;
	CustomerAddress: String @readonly;
	CustomerName: String @readonly;
	CustomerEmail: String @readonly;
	order : Association to many Order	on order.fld_OrderCustomer = $self;
	client : Association to Client;
}
entity Product {
	key ID :UUID;
	Price: Decimal @readonly;
	Category: String @mandatory;
	ProductName: String @readonly;
	ProductID: String @readonly;
	Description: String @readonly;
	client : Association to many Client	on client.fld_ClientProduct = $self;
}
entity Client {
	key ID :UUID;
	ClientEmail: String @readonly;
	ClientPhone: String @mandatory;
	ClientName: String @readonly;
	ClientAddress: String @readonly;
	fld_ClientProduct : Association to Product;
	clientCustomer : Association to Customer;
}
entity Invoice {
	key ID :UUID;
	InvoiceDate: DateTime @readonly;
	InvoiceNumber: String @readonly;
	TotalAmount: Decimal @readonly;
}
entity Payment {
	key ID :UUID;
	PaymentDate: DateTime @readonly;
	AmountPaid: Decimal @readonly;
}
entity Shipment {
	key ID :UUID;
	Status: String @readonly;
	ShipmentDate: DateTime @readonly;
}

