sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/f/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, fioriLibrary, Filter, FilterOperator,) {
        "use strict";

        return Controller.extend("app.project1.controller.List", {
            onInit: function () {
                this._oTable = this.byId("table0");
                /*  var oDetailModel = new sap.ui.model.json.JSONModel();
                 this.getView().setModel(oDetailModel, "detailModel");
                */


            },
            _validateInputs: function(aInputs) {

                var oModel = this.getView().getModel("mainModel");

                var aPromises = [];

           

                aInputs.forEach((oInput) => {

                    var sField = oInput.getId().includes("ID") ? "ID" : "name";

                    var sValue = oInput.getValue();

           

                    var oPromise = new Promise((resolve, reject) => {

                        // Check if the input value is empty

                        if (!sValue) {

                            oInput.setValueState("Error");

                            oInput.setValueStateText("Ce champ est obligatoire et ne peut pas être vide.");

                            resolve(true); // True indicates a validation error

                            return; // Exit early to avoid unnecessary OData call

                        }

           

                        var oListBinding = oModel.bindList("/Entity", undefined, undefined, [

                            new sap.ui.model.Filter(sField, sap.ui.model.FilterOperator.EQ, sValue)

                        ])
           

                        oListBinding.requestContexts().then(function(aContexts) {

                            if (aContexts && aContexts.length > 0) {

                                oInput.setValueState("Error");

                                oInput.setValueStateText("La valeur '" + sValue + "' pour '" + sField + "' existe déjà.");

                                resolve(true); // True indicates a validation error

                            } else {

                                oInput.setValueState("None");

                                resolve(false); // False indicates no validation error

                            }

                        }).catch(function(oError) {

                            oInput.setValueState("Error");

                            oInput.setValueStateText("Erreur lors de la vérification de la valeur.");

                            resolve(true); // Treat fetching errors as validation errors

                        });

                    });

                    aPromises.push(oPromise);

                });

           

                return Promise.all(aPromises);

            },

           

            onCreate: function () {

                var oView = this.getView(),

                    aInputs = [oView.byId("EntityID"), oView.byId("EntityNamee")];
                    var oModel1 = this.getOwnerComponent().getModel("detailModel");


           

                this._validateInputs(aInputs).then((aValidationResults) => {

                    var bValidationError = aValidationResults.some(result => result === true);

           

                    if (!bValidationError) {

                        const oList = this._oTable;

                        const oBinding = oList.getBinding("items");

 

                        oBinding.create({

                            "ID": this.byId("EntityID").getValue(),

                            "name": this.byId("EntityNamee").getValue(),

                        });
                        aInputs.forEach((oInput) => { 
                            oInput.setValue("")
                        });
                        var oModel = this.getOwnerComponent().getModel("mainModel");
                        var sUrl1 = oModel.sServiceUrl + "/Entity";
                        fetch(sUrl1)
                        .then(response => {
                          if (!response.ok) {
                            throw new Error('Network response was not ok');
                          }
                          return response.json();
                        })
                        .then(data => {
                          // Create a JSON model containing the fetched data
              
                          oModel1.setData(data.value);
              
                          console.log("patronnnnnnnnnnnnnnnnnnnnnnnnnnns", oModel1.getData());
              
                          // Set the JSON model on the controls
              
                        })
                        .catch(error => {
                          // Handle errors in fetching data
                          console.error('Error fetching data:', error);
                        });
                        

                        MessageToast.show("The input is validated. Your Entity has been Created.");

                    } else {

                        MessageBox.alert("A validation error has occurred.Check your Id and your EntityName");

                    }

                }).catch((oError) => {

                    MessageBox.alert("An error occurred during the validation process.");

                });

            },


            onOpenAddDialog: function () {
                this.getView().byId("OpenDialog").open();
            },
            onCancelDialog: function (oEvent) {
                oEvent.getSource().getParent().close();
            },
            onEditMode: function () {
                this.byId("editModeButton").setVisible(false);
                this.byId("saveButton").setVisible(true);
                this.byId("deleteButton").setVisible(true);
               // this.rebindTable(this.oEditableTemplate, "Edit");
            },
            onDelete: function () {

                var oSelected = this.byId("table0").getSelectedItem();
                if (oSelected) {
                    var oSalesOrder = oSelected.getBindingContext("mainModel").getObject().soNumber;

                    oSelected.getBindingContext("mainModel").delete("$auto").then(function () {
                        MessageToast.show(oSalesOrder + " SuccessFully Deleted");
                    }.bind(this), function (oError) {
                        MessageToast.show("Deletion Error: ", oError);
                    });
                } else {
                    MessageToast.show("Please Select a Row to Delete");
                }

            },
            onFetchAssociations: function() { 
             
                var oModel = this.getView().getModel("mainModel");
                var sUrl = oModel.sServiceUrl + "/Association";
                var sUrl1 = oModel.sServiceUrl + "/Entity";  // Assurez-vous que le nom de l'entité est correct
                fetch(sUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        var Model = this.getOwnerComponent().getModel("associationModel");



                        Model.setData(data);

            
                        // Vous pouvez également ici rafraîchir le binding du tableau si nécessaire


                    })
                    .catch(error => {
                        console.error("Failed to fetch associations:", error);
                    });
                    fetch(sUrl1)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        var Model1 = this.getOwnerComponent().getModel("serviceModel");



                        Model1.setData(data);

            
                        // Vous pouvez également ici rafraîchir le binding du tableau si nécessaire


                    })
                    .catch(error => {
                        console.error("Failed to fetch associations:", error);
                    });
                   
                   
                    
            },
            
            onListItemPress: function (oEvent) {
                var oItem = oEvent.getSource();
                var oSelectedContext = oItem.getBindingContext("mainModel");
                var selectedObj = oSelectedContext.getObject();
                var oModel = this.getOwnerComponent().getModel("detailModel");
                oModel.setData(selectedObj);
                this.onFetchAssociations() ; 
                

                
                this.getOwnerComponent().getRouter().navTo("Details", {
                    index: selectedObj.ID
                });
                var Model = this.getOwnerComponent().getModel("localModel");
                Model.setProperty("/layout", "TwoColumnsMidExpanded");






            },

            filterEntityById: function (id) {
                let oModel = this.getView().getModel();
                let aFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, id);

                oModel.bindList("{mainModel>/Entity}", undefined, undefined, [aFilter]).requestContexts().then(function (aContexts) {
                    aContexts.forEach(oContext => {
                        console.log(oContext.getObject());
                    });
                });
            },
            onSearch: function (oEvent) {
                // add filter for search
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("name", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }

                // update list binding
                var oUploadSet = this.byId("table0");
                var oBinding = oUploadSet.getBinding("items");
                oBinding.filter(aFilters, "Application");
            },
            onUpdate: function () {
                var oSelected = this.getView().byId("table0").getSelectedItem();
                if (oSelected) {
                    var oContext = oSelected.getBindingContext("mainModel");
                    if (oContext) {
                        var sNewName = this.getView().byId("EntityName").getValue();
                        oContext.setProperty("name", sNewName); // Assuming "name" is the property you want to update
                        var oModel = this.getView().getModel("mainModel");
                        oModel.submitBatch("yourGroupId").then(function () {
                            // Success callback
                            MessageToast.show("Update successful");
                        }).catch(function (oError) {
                            // Error callback
                            MessageToast.show("Update failed: " + oError.message);
                        });
                    } else {
                        MessageToast.show("Invalid Entity Name");
                    }
                } else {
                    MessageToast.show("Please select a row to update");
                }
            }


            ,



        });
    });