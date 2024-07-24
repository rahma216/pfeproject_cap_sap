this._validateInputs(aInputs).then((aValidationResults) => {
  var bValidationError = aValidationResults.some(result => result === true);

  if (!bValidationError) {
    var sID = this.byId("fldd").getText();
     
     
    var oModel = this.getView().getModel("mainModel");
    var sUrl = oModel.sServiceUrl + "/Entity";


    var array = this.getView().byId("annotations").mProperties.selectedKeys;
    var annotations = array.join(" ");
    var key = this.byId("key").getValue();
    var skey;

    // Convert string to boolean
    if (key.toLowerCase() === "true") {
      skey = true;
    } else if (key.toLowerCase() === "false") {
      skey = false;
    } else {
      // Handle invalid input if necessary
      console.error("Invalid input. Cannot convert to boolean.");
    }




    if (oModel) {
      console.log("Main model found");
      fetch(sUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log("Data:", data);
          if (data && data.value && Array.isArray(data.value)) {

            const entities = data.value;


            const entityWithID = entities.find(entity => entity.ID === sID);
            if (entityWithID) {
              console.log("Entity with ID :", entityWithID);

              const oEntity = entityWithID;
              console.log("aaaaa", oEntity)
              const oList2 = this.getView().byId("table1");
              const oBinding2 = oList2.getBinding("items");


              const oContext = oBinding2.create({
                "value": this.byId("field").getValue(),
                "type": this.byId("idComboBoxSuccess").getValue(),
                "fld": oEntity,
                "annotations": annotations,
                "iskey": skey


              });
              var oView = this.getView(),

                aInputs = [oView.byId("field"), oView.byId("idComboBoxSuccess"), , oView.byId("key")];
              aInputs.forEach((oInput) => {
                oInput.setValue("")
              });
              var oMultiComboBox = this.getView().byId("annotations");
              oMultiComboBox.setSelectedKeys([]);




  


            } else {
              console.log("Entity with ID " + sID + " not found");
            }
          } else {
            console.error("Invalid data format:", data);
          }
        })
        .catch(error => {
          console.error("Error:", error);
        });
    } else {


      console.error("Main model not found");
    }

  } else {
      MessageBox.alert("A validation error has occurred");
  }
}).catch((oError) => {
  MessageBox.alert("An error occurred during the validation process.");
});