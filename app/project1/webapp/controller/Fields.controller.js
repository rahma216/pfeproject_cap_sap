sap.ui.define(
  [
      "sap/ui/core/mvc/Controller",
      "sap/f/library",
      "sap/m/MessageToast",
      "sap/ui/core/Fragment",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/m/MessageBox"



  ],
  function (BaseController, fioriLibrary,MessageToast,Fragment,Filter,FilterOperator,MessageBox) {
      "use strict";

      return BaseController.extend("app.project1.controller.Fields", {
          onInit: function () {
           var ID=""
           var ID2=""
              var actions = {
                  "Actions": [
                      { key: 0, type: "String" },
                      { key: 1, type: "Int32" },
                      { key: 1, type: "Int16" },
                      { key: 1, type: "UInt8" },
                      { key: 1, type: "Integer" },
                      { key: 0, type: "Double" },
                      { key: 1, type: "Decimal" },
                      { key: 1, type: "DateTime" },
                      { key: 1, type: "Date" },
                      { key: 1, type: "Integer" },
                      { key: 2, type: "Boolean" },
                  ]
              };
              var annotations = {
                  "Annotations": [
                      { key: 0, name: "@readonly" },
                      { key: 1, name: "@mandatory" },
                      { key: 2, name: "@assert.unique" },
                      { key: 3, name: "@assert.integrity" },
                      { key: 3, name: "@assert.notNull" }


                  ]
              };
              var oViewModel = new sap.ui.model.json.JSONModel({
                  showTable: false // Initially set to false to hide the table
              });

              var AssociationType = {
                  "Type": [
                    { key: 0, type: "ManyToMany" },
                    { key: 1, type: "ManyToOne" },
                    { key: 2, type: "OneToOne" },
                  ]
                };
                var oModel = new sap.ui.model.json.JSONModel(AssociationType);
                this.getView().setModel(oModel, "AssociationType");
              this.getView().setModel(oViewModel, "viewModel");
            
              var oModel = new sap.ui.model.json.JSONModel(actions);
              this.getView().setModel(oModel, "actions");
              var oModel = new sap.ui.model.json.JSONModel(annotations);
              this.getView().setModel(oModel, "annotations");

              var oModel = this.getView().getModel("selectedEntityModel");
              this.getView().setModel(oModel, "selectedEntityModel"); 

              this.oRouter = this.getOwnerComponent().getRouter();
              this.oRouter.getRoute("Details").attachPatternMatched(this._onFieldsMatched, this);
            


          }
          ,
          _onFieldsMatched: function (oEvent) {
            this.index = oEvent.getParameter("arguments").index || "0";
            this.ID2=this.index;
           


                     ////////////////
                     var oModel = this.getView().getModel("mainModel");
var sUrl2 = oModel.sServiceUrl + "/Entity";
fetch(sUrl2)
.then(response => {
if (!response.ok) {
    throw new Error('Network response was not ok');
}
return response.json();
})
.then(data1 => {
var entities=data1.value;
entities.forEach(element => {
                    
    if (element.ID == this.index) {
      this.ID=element.name;
    }

});
console.log("eeeeeeeeeeeee",this.ID)
this.getView().bindElement({
  path: "/Entity/" + this.index,
  model: "mainModel"
});

var Model = this.getOwnerComponent().getModel("associationModel");

this.getView().setModel(Model, "associationsModel");

// Vous pouvez également ici rafraîchir le binding du tableau si nécessaire
this.getView().byId("associationsTable").setModel(Model);

this.onFilterAssociations(this.ID); 



})
.catch(error => {
console.error("Failed to fetch associations:", error);
});

console.log("eeeeeeeeeeeee",this.ID)
this.getView().bindElement({
  path: "/Entity/" + this.index,
  model: "mainModel"
});


            ///////////////////


   


        },

          onEditToggleButtonPress: function () {

              var oObjectPage = this.getView().byId("ObjectPageLayout"),
                  bCurrentShowFooterState = oObjectPage.getShowFooter();

              oObjectPage.setShowFooter(!bCurrentShowFooterState);
          },
          onSupplierPress: function () {
            this.getOwnerComponent().getEventBus().publish("servicechannel", "initdata");
              var Model = this.getOwnerComponent().getModel("localModel");
              this.getOwnerComponent().getRouter().navTo("Association");

              Model.setProperty("/layout", "ThreeColumnsEndExpanded");


          },

          onCancelDialog: function (oEvent) {
              oEvent.getSource().getParent().close();
          },
          onFilterAssociations: function(ID) {
              
              var oTable = this.getView().byId("associationsTable");
              this._updateAssociationsModel();
              var oBinding = oTable.getBinding("items");
          
              if (ID) {
                this._updateAssociationsModel();
                //soit entitysource soit entitytarget
                  var oFilterSource = new sap.ui.model.Filter("entitySource1", sap.ui.model.FilterOperator.EQ, ID);
                  var oFilterTarget = new sap.ui.model.Filter("entityTarget1", sap.ui.model.FilterOperator.EQ, ID);
                  var oCombinedFilter = new sap.ui.model.Filter({
                      filters: [oFilterSource, oFilterTarget],
                      and: false
                  });
                  this._updateAssociationsModel();
          
                  oBinding.filter(oCombinedFilter);
                  this._updateAssociationsModel();
              } else {
                this._updateAssociationsModel();
                  // Si aucun ID n'est fourni, enlever les filtres pour afficher toutes les associations
                  oBinding.filter([]);
              }
          },
          
          onFetchAssociations: function() { 
              if (this.getView().byId("associationsTable").getVisible()==true)
              {
                  this.getView().byId("associationsTable").setVisible(false);
              }
              else {
                  this.getView().byId("associationsTable").setVisible(true);

              }
             
           

                 
                 
                 
                  
          },
          



          onCreate2: function () {
            var sID = this.byId("fldd").getText();
     
     
            var oModel = this.getView().getModel("mainModel");
            var sUrl = oModel.sServiceUrl + "/Entity";
            /*  var oViewModel = this.getView().getModel("viewModel");
           
             // Toggle the showTable property
             var bShowTable = oViewModel.getProperty("/showTable");
             oViewModel.setProperty("/showTable", !bShowTable);
            */
     
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
     
     
     
     
                      /*
                              var oFilter = new sap.ui.model.Filter({
                                  path: "fld_ID", // Le chemin du champ à filtrer
                                  operator: sap.ui.model.FilterOperator.EQ, // Opérateur de comparaison
                                  value1: sID // La valeur de filtrage
                              });
                     
                              oBinding2.filter(oFilter); */
     
     
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
     
     
          },
          onShowTablePress: function () {
              // Get the view model
              var oViewModel = this.getView().getModel("viewModel");

              // Toggle the showTable property
              var bShowTable = oViewModel.getProperty("/showTable");
              oViewModel.setProperty("/showTable", !bShowTable);

              var oModel = this.getView().getModel("mainModel");
              var sUrl1 = oModel.sServiceUrl + "/Entity";
              var sUrl2 = oModel.sServiceUrl + "/Field";

              if (oModel) {
                  console.log("Main model found");

                  // Fetch entity data
                  fetch(sUrl1)
                      .then(response => {
                          if (!response.ok) {
                              throw new Error('Network response was not ok');
                          }
                          return response.json();
                      })
                      .then(entityData => {
                          console.log("Entity Data:", entityData);
                          const entities = entityData.value;
                          // Fetch field data
                          fetch(sUrl2)
                              .then(response => {
                                  if (!response.ok) {
                                      throw new Error('Network response was not ok');
                                  }
                                  return response.json();
                              })
                              .then(fields => {
                                  console.log("Fields:", fields);
                                  const entityDataa = [];


                                  // Associez les champs aux entités
                                  entities.forEach(entity => {
                                      const entityFields = fields.value.filter(field => field.fld_ID === entity.ID);


                                      // Ajoutez les données de l'entité avec ses champs associés au tableau
                                      entityDataa.push({
                                          ID: entity.ID,
                                          name: entity.name,
                                          fields: entityFields
                                      });
                                  });
                                  const oView0 = this.getView();
                                  const oModel0 = new sap.ui.model.json.JSONModel();
                                  oModel0.setData({ entityData: entityDataa });
                                  oView0.setModel(oModel0);

                                  // Fetch association data
                                  /*  fetch(sUrl3)
                                       .then(response => {
                                           if (!response.ok) {
                                               throw new Error('Network response was not ok');
                                           }
                                           return response.json();
                                       })
                                       .then(associations => {
                                           console.log("Associations:", associations);
             
             
                                           // Set the generated CDS entities to the view model or do other operations
                                           const oView0 = this.getView();
                                           const oModel0 = new sap.ui.model.json.JSONModel();
                                           oModel0.setData({ entityData: entityDataa });
                                           oView0.setModel(oModel0);
                                           const fileName = 'entityData.json';
                                           const filePath = './controller/' + fileName;
                                           // Call generateCDSEntities here
                                           const cdsEntities = this.generateCDSEntities(entityData.value, fields.value, associations.value);
                                           console.log(cdsEntities);
                                       })
                                       .catch(error => {
                                           console.error("Error retrieving associations:", error);
                                       });  */

                                  // Process entity and field data
                                  // Set the entity data to the view model or do other operations
                              })
                              .catch(error => {
                                  console.error("Error retrieving fields:", error);
                              });
                      })
                      .catch(error => {
                          console.error("Error retrieving entities:", error);
                      });
              } else {
                  console.error("Main model not found");
              }
          },
          onUpdate: function () {
            var oSelected = this.getView().byId("table1").getSelectedItem();
            if (oSelected) {
                var oContext = oSelected.getBindingContext("mainModel");
                if (oContext) {
                    var skey = this.getView().byId("iskey").getValue();
                    var svalue = this.getView().byId("value").getValue();
                    var stype = this.getView().byId("idComboBoxupdate").getValue();
                    var sannotations=this.getView().byId("annotationsupdate").getSelectedKeys();
                    var annotations = sannotations.join(" ");
                    var bIsKey;
                   
                    // Convert string to boolean
                    if (skey.toLowerCase() === "true") {
                        bIsKey = true;
                    } else if (skey.toLowerCase() === "false") {
                        bIsKey = false;
                    } else {
                        // Handle invalid input if necessary
                        console.error("Invalid input. Cannot convert to boolean.");
                    }




                    oContext.setProperty("iskey", bIsKey);
                    oContext.setProperty("value", svalue);
                    oContext.setProperty("type", stype);
                    oContext.setProperty("annotations", annotations);




                    var oModel = this.getView().getModel("mainModel");
                    oModel.submitBatch("yourGroupId").then(function () {
                        // Success callback
                        MessageToast.show("Update successful");
                    }).catch(function (oError) {
                        // Error callback
                        MessageToast.show("Update failed: " + oError.message);
                    });
                } else {
                    MessageToast.show("Invalid Field");
                }
            } else {
                MessageToast.show("Please select a row to update");
            }
        },
          onDelete: function () {
            var oSelected = this.byId("table1").getSelectedItem();
            if (oSelected) {
       
                // Création du dialogue de confirmation
                if (!this._oDialog) {
                    this._oDialog = new sap.m.Dialog({
                        title: "Confirmation",
                        type: "Message",
                        content: new sap.m.Text({ text: "Do you really want to delete the selected Field?" }),
                        beginButton: new sap.m.Button({
                            text: "Confirm",
                            type: sap.m.ButtonType.Accept,
                            press: function () {
                                // Suppression de l'entité en cas de confirmation
                                oSelected.getBindingContext("mainModel").delete("$auto").then(function () {
                                    MessageToast.show("Field successfully deleted");
                                }.bind(this)).catch(function (oError) {
                                    MessageToast.show("Deletion error: " + oError.message);
                                });
                                this._oDialog.close();
                            }.bind(this)
                        }),
                        endButton: new sap.m.Button({
                            text: "Cancel",
                            type: sap.m.ButtonType.Reject,
                            press: function () {
                                this._oDialog.close();
                            }.bind(this)
                        }),
                        afterClose: function () {
                            this._oDialog.destroy();
                            this._oDialog = null;
                        }.bind(this)
                    });
                }
       
                this._oDialog.open();
            } else {
                MessageToast.show("Please select a row to delete");
            }
        },
          onDeleteAssociation: function(oEvent) {
              var oModel = this.getView().getModel("mainModel");
              var oTable = this.byId("associationsTable");
// Adjust the property and value for filtering
var propertyToFilter = "ID"; // Change this to the property you want to filter by
var valueToFilter = "f9010c85-e8fb-451d-8ebd-2fcb5e3df114"; // Change this to the value you want to filter for

// Fetch the binding object
var oBindList = oModel.bindList("/Association");

// Create the filter based on the specified property and value
var filter = new sap.ui.model.Filter(propertyToFilter, sap.ui.model.FilterOperator.EQ, valueToFilter);

// Request contexts for the filtered associations
oBindList.filter(filter).requestContexts().then(function (aContexts) {
  if (aContexts.length > 0) {
      // Delete each association
      aContexts.forEach(function(context) {
          context.delete().then(function() {
              sap.m.MessageToast.show("Association Successfully Deleted");
              oModel.submitBatch("yourGroupId").then(function () {
                  // Success callback
                  MessageToast.show("Update successful");
              }).catch(function (oError) {
                  // Error callback
                  MessageToast.show("Update failed: " + oError.message);
              });
              this._onFieldsMatched();
              oTable.getBinding("items").refresh();
            
              this.getView().bindElement();

          }).catch(function(oError) {
              sap.m.MessageToast.show("Deletion Error: " + oError.message);
          });
      });
  } else {
      sap.m.MessageToast.show("Associations with " + propertyToFilter + " equal to " + valueToFilter + " not found.");
  }
}).catch(function(oError) {
  sap.m.MessageToast.show("Error: " + oError.message);
});

          }
          
          
          
,   
deleteAssociation: function () {
  var oSelected = this.byId("associationsTable").getSelectedItem();

  if (oSelected) {
      var oContext = oSelected.getBindingContext("associationsModel");
      if (oContext) {
          // Accéder aux données du contexte
          var oData = oContext.getObject();
          console.log("Data from context:", oData);

          // Récupérer l'ID directement du contexte
          var sID = oData.ID;
          console.log("Selected Item ID:", sID);

          var oModel = this.getView().getModel("mainModel");
          var oModel2 = this.getView().getModel("associationsModel");
          let oBindList = oModel.bindList("/Association");
          let aFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, sID);

          /////////////////////
        /*   let oBindList2 = oModel2.bindList("/value");
          console.log("mmmmmmmmmmmmmmm",oBindList2)
  
          oBindList2.filter(aFilter).requestContexts().then(function (aContexts) {
            if (aContexts.length > 0) {
                aContexts[0].delete().then(() => {
                    // Vérifier si le composant propriétaire est disponible
                    var oOwnerComponent = this.getOwnerComponent();
                    if (oOwnerComponent) {
                        // Publish the event after deletion
                        oOwnerComponent.getEventBus().publish("servicechannel2", "onlistitempress2", { index: this.ID2 });
                    } else {
                        console.error("Owner component is not available.");
                    }
                }).catch((error) => {
                    console.error("Error deleting item:", error);
                });
            } else {
                console.log("No matching context found for ID:", sID);
            }
        }).catch((error) => {
            console.error("Error requesting contexts:", error);
        });
         */

          ////////////////////////

          oBindList.filter(aFilter).requestContexts().then(function (aContexts) {
            if (aContexts.length > 0) {
              aContexts[0].delete().then(() => {
                  // Vérifier si le composant propriétaire est disponible
                  var oOwnerComponent = this.getOwnerComponent();
                  if (oOwnerComponent) {
                      // Publish the event after deletion
                      oOwnerComponent.getEventBus().publish("servicechannel2", "onlistitempress2", { index: this.ID2 });
                  } else {
                      console.error("Owner component is not available.");
                  }
              }).catch((error) => {
                  console.error("Error deleting item:", error);
              });
          } else {
              console.log("No matching context found for ID:", sID);
          }
          
          }.bind(this)).catch((error) => {
              console.error("Error requesting contexts:", error);
          });
      } else {
          console.error("No binding context found for the selected item.");
      }
  } else {
      console.error("No item selected.");
  }
}
,

onOpenAddDialog2: function () {
  var oSelected = this.getView().byId("table1").getSelectedItem();
 
  if (oSelected) {
      var oContext = oSelected.getBindingContext("mainModel");
      if (oContext) {
          // Récupérer les valeurs actuelles
          var bIsKey = oContext.getProperty("iskey");
          var sValue = oContext.getProperty("value");
          var sType = oContext.getProperty("type");
          var sAnnotations = oContext.getProperty("annotations");
 
          // Initialiser les champs d'entrée avec les valeurs actuelles
          this.getView().byId("iskey").setValue(bIsKey.toString()); // Convertir en string pour l'input
          this.getView().byId("value").setValue(sValue);
          this.getView().byId("idComboBoxupdate").setValue(sType);
 
          // Ouvrir le dialogue
          this.getView().byId("OpenDialog2").open();
      } else {
          MessageToast.show("Champ invalide");
      }
  } else {
      MessageToast.show("Please select a row to update");
  }
},
          formatFieldsValue: function (fields) {
              if (Array.isArray(fields)) {
                  return fields.map(field => field.value).join(', '); // Concatenate values with comma separator
              } else {
                  return '';
              }
          },
        
          

          handleClose: function () {
              var Model = this.getOwnerComponent().getModel("localModel");
              Model.setProperty("/layout", "OneColumn");
              this.getOwnerComponent().getRouter().navTo("Listview");
          },
          onCreate: function () {
            var oModel = this.getView().getModel("mainModel");
            var input1 = this.getView().byId("sourceInput").getValue();
            var input2 = this.getView().byId("targetInput").getValue();
            var type = this.getView().byId("associationtype").getValue();
            var sUrl1 = oModel.sServiceUrl + "/Entity";
            var sUrl2 = oModel.sServiceUrl + "/Association";
        
            var entity1 = {};
            var entity2 = {};
            if (oModel) {
                fetch(sUrl1)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(entityData => {
                        const entities = entityData.value;
                        entities.forEach(element => {
                            if (element.name == input1) {
                                entity1 = element;
                            }
                            if (element.name == input2) {
                                entity2 = element;
                            }
                        });
        
                        if (entity1 === entity2) {
                            var oView = this.getView();
                            var aInputs = [oView.byId("targetInput"), oView.byId("associationtype")];
                            aInputs.forEach(oInput => oInput.setValue(""));
                            this.showSameEntityConfirmationPopup();
                        } else {
                            fetch(sUrl2)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    const associations = data.value;
                                    let associationExists = false;
                                    associations.forEach(element => {
                                        if ((element.entitySource_ID === entity1.ID && element.entityTarget_ID === entity2.ID) ||
                                            (element.entityTarget_ID === entity1.ID && element.entitySource_ID === entity2.ID)) {
                                            associationExists = true;
                                        }
                                    });
        
                                    if (associationExists) {
                                        var oView = this.getView();
                                        var aInputs = [oView.byId("targetInput"), oView.byId("associationtype")];
                                        aInputs.forEach(oInput => oInput.setValue(""));
                                    } else {
                                        var oBindList = oModel.bindList("/Association");
                                        oBindList.create({
                                            entitySource: entity1,
                                            entityTarget: entity2,
                                            type: type
                                        }).created().then(() => {
                                            // Fetch new associations and update the model
                                            this._updateAssociationsModel();
                                            this.onFilterAssociations(this.ID); 
                                          
                                           // this.getOwnerComponent().getEventBus().publish("servicechannel2", "onlistitempress2(this.ID2)", this.ID2);
                                           var oEventBus = this.getOwnerComponent().getEventBus();
                                           oEventBus.publish("servicechannel2", "onlistitempress2", { index: this.ID2 });
                                            // Mettre à jour la visibilité du tableau
    var oTable = this.getView().byId("associationsTable");
    oTable.setVisible(true);


                                        });
                                        var oView = this.getView();
                                        var aInputs = [oView.byId("targetInput"), oView.byId("associationtype")];
                                        aInputs.forEach(oInput => oInput.setValue(""));
                                    }
                                })
                                .catch(error => {
                                    console.error(error);
                                });
                        }
                    })
                    .catch(error => {
                        console.error("Error retrieving entities:", error);
                    });
            } else {
                console.error("Model 'mainModel' is not defined or accessible in the view.");
            }
        },
        
        // Helper function to update the associations model
        _updateAssociationsModel: function() {
          var oModel = this.getView().getModel("associationsModel");
          if (!oModel) {
              console.error("Model 'associationsModel' is not defined or accessible in the view.");
              return;
          }
      
          var data = oModel.getProperty("/value");
          if (!data) {
              console.error("No data found in 'associationsModel'.");
              return;
          }
      
          // Assuming the data is being persisted or fetched from a backend, 
          // you can handle this as per your application's requirements.
          // Here, we will log the data to confirm it's being updated.
          console.log("Associations data:", data);
      
          // Refresh the table to reflect the updated data
          var oTable = this.getView().byId("associationsTable");
          oTable.getBinding("items").refresh();
      }
      
,        
          onSuggestionItemSelected: function (oEvent) {
              var oItem = oEvent.getParameter("selectedItem");
              var oText = oItem ? oItem.getKey() : "";
      
      
              this.byId("selectedKeyIndicator").setText(oText);
            },
            onSuggestionItemSelected1: function (oEvent) {
              var oItem = oEvent.getParameter("selectedItem");
              var oText = oItem ? oItem.getKey() : "";
      
      
              this.byId("selectedKeyIndicator").setText(oText);
            },
            onValueHelpRequest: function (oEvent) {
              var sInput = oEvent.getSource();
              var sInputValue = oEvent.getSource().getValue(),
                oView = this.getView();
      
              if (!this._pValueHelpDialog) {
                this._pValueHelpDialog = Fragment.load({
                  id: oView.getId(),
                  name: "app.project1.view.ValueHelpDialog",
                  controller: this
                }).then(function (oDialog) {
                  oView.addDependent(oDialog);
                  return oDialog;
                });
              }
              this._pValueHelpDialog.then(function (oDialog) {
                // Create a filter for the binding
                oDialog.getBinding("items").filter([new Filter("name", FilterOperator.Contains, sInputValue)]);
                // Open ValueHelpDialog filtered by the input's value
                oDialog.open(sInputValue);
              });
            },
            onValueHelpDialogSearch: function (oEvent) {
              var sValue = oEvent.getParameter("value");
              var oFilter = new Filter("name", FilterOperator.Contains, sValue);
      
              oEvent.getSource().getBinding("items").filter([oFilter]);
            },
      
            onValueHelpDialogClose: function (oEvent) {
              var sDescription,
                oSelectedItem = oEvent.getParameter("selectedItem");
              oEvent.getSource().getBinding("items").filter([]);
      
              if (!oSelectedItem) {
                return;
              }
                      sDescription = oSelectedItem.getDescription();
              this.byId("sourceInput").setValue(sDescription);

      
            },
      
            
            onValueHelpRequest1: function (oEvent) {
              var sInputValue = oEvent.getSource().getValue(),
                oView = this.getView();
      
              if (!this._pValueHelpDialog1) {
                this._pValueHelpDialog1 = Fragment.load({
                  id: oView.getId(),
                  name: "app.project1.view.ValueHelp",
                  controller: this
                }).then(function (oDialog) {
                  oView.addDependent(oDialog);
                  return oDialog;
                });
              }
              this._pValueHelpDialog1.then(function (oDialog) {
                // Create a filter for the binding
                oDialog.getBinding("items").filter([new Filter("name", FilterOperator.Contains, sInputValue)]);
                // Open ValueHelpDialog filtered by the input's value
                oDialog.open(sInputValue);
              });
            },
      
            onValueHelpDialogSearch1: function (oEvent) {
              var sValue = oEvent.getParameter("value");
              var oFilter = new Filter("name", FilterOperator.Contains, sValue);
      
              oEvent.getSource().getBinding("items").filter([oFilter]);
            },
      
            onValueHelpDialogClose1: function (oEvent) {
              var sDescription,
                oSelectedItem = oEvent.getParameter("selectedItem");
              oEvent.getSource().getBinding("items").filter([]);
      
              if (!oSelectedItem) {
                return;
              }
      
      
              sDescription = oSelectedItem.getDescription();
              this.byId("targetInput").setValue(sDescription);
      
            },
            showSameEntityConfirmationPopup: function() {
              var that = this;
              var dialog = sap.m.MessageBox.show(
                  "You have selected the same entity for both the source and target entities. Please select different entities",
                  {
                      icon: sap.m.MessageBox.Icon.WARNING,
                      title: "Confirmation",
                      actions: [sap.m.MessageBox.Action.OK],
                      onClose: function(oAction) {
                          if (oAction === sap.m.MessageBox.Action.OK) {
                              // L'utilisateur a choisi de continuer, rien à faire ici
                          }
                      }
                  }
              );
          
              // Désactiver le bouton "OK" après l'affichage de la boîte de dialogue
              dialog.getBeginButton().setEnabled(false);
          },
          OnCdsgen: function () {
 
            var oModel = this.getView().getModel("mainModel");
            var sUrl1 = oModel.sServiceUrl + "/Entity";
            var sUrl2 = oModel.sServiceUrl + "/Field";
            var sUrl3 = oModel.sServiceUrl + "/Association"; // URL to fetch associations
     
            if (oModel) {
              console.log("Main model found");
     
              // Fetch entity data
              fetch(sUrl1)
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                  return response.json();
                })
                .then(entityData => {
                  console.log("Entity Data:", entityData);
     
                  const entities = entityData.value;
                  // Fetch field data
                  fetch(sUrl2)
                    .then(response => {
                      if (!response.ok) {
                        throw new Error('Network response was not ok');
                      }
                      return response.json();
                    })
                    .then(fields => {
                      console.log("Fields:", fields);
                      const entityDataa = [];
     
                      // Associez les champs aux entités
                      entities.forEach(entity => {
                        const entityFields = fields.value.filter(field => field.fld_ID === entity.ID);
     
                        // Ajoutez les données de l'entité avec ses champs associés au tableau
                        entityDataa.push({
                          ID: entity.ID,
                          name: entity.name,
                          fields: entityFields
                        });
                      });
     
                      // Fetch association data
                      fetch(sUrl3)
                        .then(response => {
                          if (!response.ok) {
                            throw new Error('Network response was not ok');
                          }
                          return response.json();
     
                        })
                        .then(associations => {
                          console.log("Associations:", associations);
     
     
     
                          this.openConfirmationDialog(() => {
                            const cdsEntities = this.generateCDSEntities(entityData.value, fields.value, associations.value);
                            // Autres traitements après confirmation
                          });
     
                        })
                        .catch(error => {
                          console.error("Error retrieving associations:", error);
                        });
     
                      // Process entity and field data
                      // Set the entity data to the view model or do other operations
                    })
                    .catch(error => {
                      console.error("Error retrieving fields:", error);
                    });
                })
                .catch(error => {
                  console.error("Error retrieving entities:", error);
                });
            } else {
              console.error("Main model not found");
            }
     
          },
          openConfirmationDialog: function(onConfirm) {
            var dialog = new sap.m.Dialog({
              title: 'Confirm Generation',
              type: 'Message',
              content: new sap.m.Text({ text: 'Do you really want to generate your data model?' }),
              beginButton: new sap.m.Button({
                text: 'Confirmer',
                press: function () {
                  dialog.close();
                  onConfirm(); // Exécute la fonction de callback si confirmé
                  this.showCDSmodelGenerationPopup();
     
                }
              }),
              endButton: new sap.m.Button({
                text: 'Annuler',
                press: function () {
                  dialog.close();
                }
              }),
              afterClose: function() {
                dialog.destroy();
              }
            });
         
            dialog.open();
          },
        
            generateCDSEntities: function (entityData, fieldsData, associationsData) {
              const cdsEntities = [];
       
              for (const entity of entityData) {
                const entityName = entity.name;
                const entityFields = fieldsData.filter(field => field.fld_ID === entity.ID);
       
                let cdsEntity = `entity ${entityName} {\n\tkey ID :UUID;`;
       
                // Process fields
                for (const field of entityFields) {
                  if (field.annotations == null) {
                    let fieldString = `\n\t${field.value}: ${field.type} `;
                    if (field.iskey) {
                      fieldString = `\n\tkey ${field.value}: ${field.type} `;
                    }
                    cdsEntity += fieldString + ';';
                  }
                  else {
                    let fieldString = `\n\t${field.value}: ${field.type} ${field.annotations}`;
                    if (field.iskey) {
                      fieldString = `\n\tkey ${field.value}: ${field.type} ${field.annotations}`;
                    }
                    cdsEntity += fieldString + ';';
                  }
       
                }
       
                const entityAssociations = associationsData.filter(association =>
                  association.entitySource_ID === entity.ID || association.entityTarget_ID === entity.ID
                );
                var ismanytomany = false;
       
                for (const association of entityAssociations) {
                  const isManyToOne = association.type === 'ManyToOne';
                  const isOneToOne = association.type === 'OneToOne';
                  const isManyToMany = association.type === 'ManyToMany';
                  const isSourceEntity = association.entitySource_ID === entity.ID;
                  const isTargetEntity = association.entityTarget_ID === entity.ID;
       
                  if (isManyToOne && isSourceEntity) {
                    const targetEntity = entityData.find(e => e.ID === association.entityTarget_ID);
                    const sourceEntity = entityData.find(e => e.ID === association.entitySource_ID);
       
                    if (targetEntity) {
                      cdsEntity += `\n\tfld_${sourceEntity.name}: Association to ${targetEntity.name};`;
                    }
                  }
       
                  if (isManyToOne && isTargetEntity) {
                    const sourceEntity = entityData.find(e => e.ID === association.entitySource_ID);
       
                    if (sourceEntity) {
                      const lowersourceEntity = sourceEntity.name.toLowerCase();
                      cdsEntity += `\n\t${lowersourceEntity} : Association to many ${sourceEntity.name}`;
       
                      cdsEntity += `\ton ${lowersourceEntity}.fld_${sourceEntity.name} = $self;`;
                    }
                  }
                  if (isOneToOne && isSourceEntity) {
                    const targetEntity = entityData.find(e => e.ID === association.entityTarget_ID);
                    if (targetEntity) {
                      var st = entity.name.toLowerCase();
       
                      cdsEntity += `\n\t${st}${targetEntity.name} : Association to ${targetEntity.name};`;
       
                    }
                  }
                  if (isOneToOne && isTargetEntity) {
                    const sourceEntity = entityData.find(e => e.ID === association.entitySource_ID);
                    if (sourceEntity) {
                      var st = sourceEntity.name.toLowerCase()
       
                      cdsEntity += `\n\t${st} : Association to ${sourceEntity.name};`;
       
                    }
                  }
       
                  if (isManyToMany && isSourceEntity) {
                    ismanytomany = true;
                    const targetEntity = entityData.find(e => e.ID === association.entityTarget_ID);
       
       
                    var str1 = entity.name.toLowerCase();
                    var str2 = targetEntity.name.toLowerCase();
                    var ch1 = entity.name;
                    var ch2 = targetEntity.name;
       
       
                    var newname = ch1 + "2" + ch2;
                    cdsEntity += `\n\t${str2}s : Composition of many ${entity.name}To${targetEntity.name} on ${str2}s.${str1}=$self;`;
       
       
       
                  }
                  if (isManyToMany && isTargetEntity) {
                    const sourceEntity = entityData.find(e => e.ID === association.entitySource_ID);
                    var str1 = sourceEntity.name.toLowerCase();
                    var str2 = entity.name.toLowerCase();
       
                    cdsEntity += `\n\t${str1}s : Composition of many ${sourceEntity.name}To${entity.name} on ${str1}s.${str2}=$self;`;
                  }
                }
       
                if (ismanytomany === true) {
       
                  cdsEntity += `\n}\n`;
                  cdsEntity += `entity ${ch1}To${ch2} {
              \n\tkey ${str1} : Association to ${ch1};
              \n\tkey ${str2} : Association to ${ch2};
              \n}\n`;
       
                }
                else {
                  cdsEntity += `\n}\n`;
                }
                cdsEntities.push(cdsEntity);
              }
              this.onAppendTextToFilePress(` namespace models;
              using { cuid, managed} from '@sap/cds/common';\n`+ cdsEntities.join(''))
       
       
              return cdsEntities.join('');
            },
            openConfirmationDialog: function(onConfirm) {
              var dialog = new sap.m.Dialog({
                title: 'Confirmer la génération',
                type: 'Message',
                content: new sap.m.Text({ text: 'Voulez-vous vraiment générer le modèle CDS?' }),
                beginButton: new sap.m.Button({
                  text: 'Confirmer',
                  press: function () {
                    dialog.close();
                    onConfirm(); // Exécute la fonction de callback si confirmé
                    this.showCDSmodelGenerationPopup();
        
                  }
                }),
                endButton: new sap.m.Button({
                  text: 'Annuler',
                  press: function () {
                    dialog.close();
                  }
                }),
                afterClose: function() {
                  dialog.destroy();
                }
              });
            
              dialog.open();
            },
            onAppendTextToFilePress: function(data) {
              var oMainModel = this.getOwnerComponent().getModel("mainModel");
              var oAction = oMainModel.bindContext("/appendTextToFile(...)");
              oAction.setParameter('content', data);
              oAction.execute().then(
                function () {
                    MessageToast.show("Cds Model generated successfulyy ");
                },
                function (oError) {
                    MessageToast.show("Error!!! ");
                });
          },



        
      });
  },
  
  





);