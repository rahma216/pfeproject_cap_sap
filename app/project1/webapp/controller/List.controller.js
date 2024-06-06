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
                    aInputs = [oView.byId("EntityNamee")];
                var oModel1 = this.getOwnerComponent().getModel("detailModel");
           
                this._validateInputs(aInputs).then((aValidationResults) => {
                    var bValidationError = aValidationResults.some(result => result === true);
           
                    if (!bValidationError) {
                        var oModel = this.getOwnerComponent().getModel("mainModel");
                        var sUrl = oModel.sServiceUrl + "/Entity";
           
                        // Fetch existing entity count
                        fetch(sUrl)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            const newID = (data.value.length + 1).toString();
                            const oList = this._oTable;
                            const oBinding = oList.getBinding("items");
           
                            // Create new entity with calculated new ID
                            oBinding.create({
                                "ID": newID,
                                "name": this.byId("EntityNamee").getValue(),
                            });
           
                            // Reset input fields after creation
                            aInputs.forEach((oInput) => {
                                oInput.setValue("");
                            });
           
                            // Optionally update your model if needed
                            oModel1.setData(data.value);
                            console.log("Updated model with data: ", oModel1.getData());
           
                            MessageToast.show("The input is validated. Your Entity has been created with ID: " + newID);
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                            MessageBox.alert("Failed to fetch existing entities count.");
                        });
                    } else {
                        MessageBox.alert("A validation error has occurred. Check your Entity Name");
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
                    var oContext = oSelected.getBindingContext("mainModel");
                    var oSalesOrder = oContext.getObject().soNumber;
                    console.log("Binding Context:", oContext);
           
                    var sPath = oContext.getPath();
           
                    // Extract the ID from the path using a regular expression
                    var aMatches = sPath.match(/\/Entity\('(\d+)'\)/);
                    if (aMatches && aMatches[1]) {
                        var sID = aMatches[1];
                        console.log("Selected Item ID:", sID);
           
                        // Open confirmation dialog
                        var oDialog = new sap.m.Dialog({
                            title: "Confirm",
                            type: "Message",
                            content: new sap.m.Text({ text: "Do you really want to delete the selected entity? " + oSalesOrder + "?" }),
                            beginButton: new sap.m.Button({
                                text: "Delete",
                                type: sap.m.ButtonType.Accept,
                                press: function () {
                                    oContext.delete("$auto").then(function () {
                                        var oModel = this.getView().getModel("mainModel");
                                        var sUrl1 = oModel.sServiceUrl + "/Field";
           
                                        // Fetch data
                                        fetch(sUrl1)
                                            .then(response => {
                                                if (!response.ok) {
                                                    throw new Error('Network response was not ok');
                                                }
                                                return response.json();
                                            })
                                            .then(data => {
                                                data.value.forEach(item => {
                                                    if (item.fld_ID === sID) {
                                                        console.log("Matching Data:", item.ID);
           
                                                        let oBindList = oModel.bindList("/Field");
                                                        let aFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, item.ID);
           
                                                        oBindList.filter(aFilter).requestContexts().then(function (aContexts) {
                                                            if (aContexts.length > 0) {
                                                                aContexts[0].delete();
                                                                this.getOwnerComponent().getEventBus().publish("servicechannel", "initdata");
                                                                console.log("Deleted Item ID:", item.ID);
                                                            } else {
                                                                console.log("No matching context found for ID:", item.ID);
                                                            }
                                                        }).catch(error => {
                                                            console.error("Error deleting item:", error);
                                                        });
                                                    }
                                                });
           
                                            })
                                            .catch(error => {
                                                console.error("Error retrieving associations:", error);
                                            });
           
                                        MessageToast.show("Entity Successfully Deleted");
                                    }.bind(this)).catch(function (oError) {
                                        MessageToast.show("Deletion Error: " + oError.message);
                                    });
                                    oDialog.close();
                                }.bind(this)
                            }),
                            endButton: new sap.m.Button({
                                text: "Cancel",
                                type: sap.m.ButtonType.Reject,
 
                                press: function () {
                                    oDialog.close();
                                }
                            }),
                            afterClose: function () {
                                oDialog.destroy();
                            }
                        });
           
                        this.getView().addDependent(oDialog);
                        oDialog.open();
                    } else {
                        MessageToast.show("Could not extract ID from the selected item.");
                    }
                } else {
                    MessageToast.show("Please Select a Row to Delete");
                }
            },
            onFetchAssociations: function() { 
             
                var oModel = this.getView().getModel("mainModel");
                var sUrl = oModel.sServiceUrl + "/Association";
                let tabS=[];
                let tabT=[];
                let typ=[];
                var sUrl2 = oModel.sServiceUrl + "/Entity";
                fetch(sUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        var Model = this.getOwnerComponent().getModel("associationModel");

                        /////////////////////////////
                        var associations=data.value;
                        associations.forEach(element => {
                     
                            tabS.push(element.entitySource_ID);
                            tabT.push(element.entityTarget_ID);
                            typ.push(element.type);

                       
                        });
                       
                        fetch(sUrl2)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data1 => {
                            var entities=data1.value;
                            for(let i=0;i<tabS.length;i++){
                                entities.forEach(element => {
                            
                                    if (element.ID == tabS[i]) {
                                      tabS[i]=element.name;
                                    }
                               
                                });

                            }
                            for(let i=0;i<tabT.length;i++){
                                entities.forEach(element => {
                        
                                    if (element.ID == tabT[i]) {
                                      tabT[i]=element.name;
                                    }
                               
                                });

                            }
                            console.log(tabS)
                            console.log(tabT)
                            var combinedData = tabS.map((sItem, index) => ({
                                entitySource1: sItem,
                                entityTarget1: tabT[index],
                                type: typ[index]
                            }));

                            var associationModel = this.getOwnerComponent().getModel("associationModel");
                            associationModel.setData({
                                value: combinedData
                            });
                                        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu",associationModel.getData());


                            //var Model = this.getOwnerComponent().getModel("associationModel");
    
    
                         
    
    
                        })
                        .catch(error => {
                            console.error("Failed to fetch associations:", error);
                        });
                    
                     // Créer un tableau d'objets avec la structure souhaitée
        
                          
                      // Mettre les données dans le modèle
         

                        //////////////////////////////////


                        
                        var associationModel = this.getOwnerComponent().getModel("associationModel");
                        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu2",associationModel.getData());


                    })
                    .catch(error => {
                        console.error("Failed to fetch associations:", error);
                    });
             
                   
                   
                    
            },
            
            onListItemPress: function (oEvent) {
                var oItem = oEvent.getSource();
                var oSelectedContext = oItem.getBindingContext("mainModel");
                var selectedObj = oSelectedContext.getObject();
              
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