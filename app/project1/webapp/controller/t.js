
var oSelected = this.byId("associationsTable").getSelectedItem();
           
if (oSelected) {
    var oContext = oSelected.getBindingContext("mainModel");
    var oSalesOrder = oContext.getObject().soNumber;
    console.log("Binding Context:", oContext);

    var sPath = oContext.getPath();

    // Extract the ID from the path using a regular expression
    var aMatches = sPath.match(/\/Association\('(\d+)'\)/);
    if (aMatches && aMatches[1]) {
        var sID = aMatches[1];
        console.log("Selected Item ID:", sID);}
      
}

let oBindList = oModel.bindList("/Association");
let aFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, ID);

oBindList.filter(aFilter).requestContexts().then(function (aContexts) {
  if (aContexts.length > 0) {
      aContexts[0].delete();
   
      console.log("Deleted Item ID:", item.ID);
  } else {
      console.log("No matching context found for ID:", item.ID);
  }
})