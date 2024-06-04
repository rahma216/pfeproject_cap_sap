_onFieldsMatched: function (oEvent) {
    this.index = oEvent.getParameter("arguments").index || "0";



      
     


this.getView().bindElement({
path: "/Entity/" + this.index,
model: "mainModel"
});
var t= this.getView().byId("rahma").getText();
console.log("tttttttttttttttttttt",t)


var Model = this.getOwnerComponent().getModel("associationModel");

this.getView().setModel(Model, "associationsModel");

// Vous pouvez également ici rafraîchir le binding du tableau si nécessaire
this.getView().byId("associationsTable").setModel(Model);



this.onFilterAssociations(t) ; 







},