sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/dnd/DragInfo",
  "sap/f/dnd/GridDropInfo",
  "./../RevealGrid/RevealGrid",
  "sap/ui/core/library",
  "sap/ui/core/Fragment",
  "sap/ui/model/json/JSONModel",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/m/MessageBox",
  "sap/ui/core/syncStyleClass",
  "sap/m/MessageToast",
  "sap/ui/core/dnd/DropInfo",
], function (
  Controller,
  DragInfo,
  GridDropInfo,
  RevealGrid,
  coreLibrary,
  Fragment,
  JSONModel,
  Filter,
  FilterOperator,
  MessageBox,
  syncStyleClass,
  MessageToast, DropInfo
) {
  "use strict";

  var DropLayout = coreLibrary.dnd.DropLayout;

  // shortcut for sap.ui.core.dnd.DropPosition
  var DropPosition = coreLibrary.dnd.DropPosition;

  return Controller.extend("app.project1.controller.Association", {

    onInit: function () {
      this.test = "";

      this.base = this.getOwnerComponent();

      var increment = 0;
      // Assurez-vous que this.base et this.base.getEditFlow sont définis
      if (!this.base || !this.base.getEditFlow) {
        console.error("Base or getEditFlow is undefined.");
      }
      this.initData();
      this.attachDragAndDrop();

    },

    initData: function () {
      var oModel = this.getOwnerComponent().getModel("mainModel");

      var oJSONModel = new sap.ui.model.json.JSONModel();
      oJSONModel.setData({
        "id": "",
        "name": ""
      });
      this.byId("grid1").setModel(oJSONModel);



      console.log(oModel)

      var sUrl1 = oModel.sServiceUrl + "/Entity";

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
          .then(data => {
            // Create a JSON model containing the fetched data
            var oODataJSONModel = new sap.ui.model.json.JSONModel();
            oODataJSONModel.setData(data.value);

            console.log("patron", oODataJSONModel);

            // Set the JSON model on the controls
            this.byId("list1").setModel(oODataJSONModel);
            console.log("aaaaaaaaaa", oODataJSONModel);

          })
          .catch(error => {
            // Handle errors in fetching data
            console.error('Error fetching data:', error);
          });
      }
    },



    onRevealGrid: function () {
      RevealGrid.toggle("grid1", this.getView());
    },

    onExit: function () {
      RevealGrid.destroy("grid1", this.getView());
    },

    attachDragAndDrop: function () {
      var oList = this.byId("list1");
      oList.addDragDropConfig(new DragInfo({
        sourceAggregation: "items"
      }));

      oList.addDragDropConfig(new DropInfo({
        targetAggregation: "items",
        dropPosition: DropPosition.Between,
        dropLayout: DropLayout.Vertical,
        drop: this.onDrop.bind(this)
      }));

      var oGrid = this.byId("grid1");
      oGrid.addDragDropConfig(new DragInfo({
        sourceAggregation: "items"
      }));

      oGrid.addDragDropConfig(new GridDropInfo({
        targetAggregation: "items",
        dropPosition: DropPosition.Between,
        dropLayout: DropLayout.Horizontal,
        dropIndicatorSize: this.onDropIndicatorSize.bind(this),
        drop: this.onDrop.bind(this)
      }));
    },

    onDropIndicatorSize: function (oDraggedControl) {
      var oBindingContext = oDraggedControl.getBindingContext();
      console.log("aaa", oBindingContext);
      var oData = oBindingContext.getModel().getProperty(oBindingContext.getPath());
      console.log("oData", oData);

      // Check if the dragged control is a StandardListItem
      if (oDraggedControl.isA("sap.m.StandardListItem")) {
        // Check if the oData object contains rows and columns properties
        if (oData) {
          return {
            rows: 2,
            columns: 3
          };
        } else {
          // Handle the case when rows and columns properties are not found
          console.error("Rows and/or columns properties not found in the data object.");
        }
      }
    },


    onDrop: function (oInfo) {
      var oDragged = oInfo.getParameter("draggedControl");
      var oDropped = oInfo.getParameter("droppedControl");
      var sInsertPosition = oInfo.getParameter("dropPosition");

      var oDragContainer = oDragged.getParent();
      var oDropContainer = oInfo.getSource().getParent();

      var oDragModel = oDragContainer.getModel();
      var oDropModel = oDropContainer.getModel();

      var oDragModelData = oDragModel.getData();
      var oDropModelData = oDropModel.getData();

      var iDragPosition = oDragContainer.indexOfItem(oDragged);
      var iDropPosition = oDropContainer.indexOfItem(oDropped);

      console.log("drag model", oDragModelData);
      console.log("drop model", oDropModelData);

      // remove the item
      var oItem = oDragModelData[iDragPosition];
      oDragModelData.splice(iDragPosition, 1);

      /*  if (oDragModel === oDropModel && iDragPosition < iDropPosition) {
           iDropPosition--;
       }
   
       if (sInsertPosition === "After") {
           iDropPosition++;
       } */

      // Ensure oDropModelData is an array
      if (!Array.isArray(oDropModelData)) {
        oDropModelData = [];
      }

      // insert the control in target aggregation
      oDropModelData.splice(iDropPosition, 0, oItem);

      if (oDragModel !== oDropModel) {
        oDragModel.setData(oDragModelData);
        oDropModel.setData(oDropModelData);
      } else {
        oDropModel.setData(oDropModelData);
      }

      this.byId("grid1").focusItem(iDropPosition);
      var grid = this.getView().byId("grid1");
      this.logGridContent(grid);
    },
    logGridContent: function (grid) {
      this.table = [];
      var items = grid.getItems();
      items.forEach(function (item) {
        var title = item.getHeader().getTitle();

        this.table.push(title);
      }.bind(this));
    },
    /////////////////////service generator
    generateService: function () {
      var cdsModel = "service modelsService {\n";

      this.table.forEach(function (entity) {
        cdsModel += "\n\tentity " + entity + " as projection on models." + entity + ";";
      });


      cdsModel += "\n}";


      console.log("Generated CDS Model:", cdsModel);
      this.onAppendServiceToFilePress(`using models from '../db/models.cds'; \n` + cdsModel);
      this.showCDSserviceGenerationPopup();
    },
    generateService2: function (test) {
      var cdsModel = "service modelsService {\n";
      var table2 = [test]; // Start with the 'test' element in table2

      // If 'this.table' is not empty and 'this.test' is a string
      if (this.table.length > 0 && typeof test === 'string') {
        // Filter out the 'test' string from 'this.table' and add the rest to 'table2'
        table2 = table2.concat(this.table.filter(item => item.trim() !== test.trim()));
      } else {
        console.error("Either 'this.table' is empty or 'this.test' is not a string.");
      }

      console.log(this.table);
      console.log("taaaablaaa", table2);


      table2.forEach(function (entity) {
        cdsModel += "\n\tentity " + entity + " as projection on models." + entity + ";";
      });


      cdsModel += "\n}";


      console.log("Generated CDS Model:", cdsModel);
      this.onAppendServiceToFilePress(`using models from '../db/models.cds'; \n` + cdsModel);

    },

    onOpenAddDialog: function () {
      this.getView().byId("OpenDialog").open();
    },
    onCancelDialog: function (oEvent) {
      oEvent.getSource().getParent().close();
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



                    const cdsEntities = this.generateCDSEntities(entityData.value, fields.value,

                      associations.value);


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
      this.showCDSmodelGenerationPopup();

    },




    generateCDSEntities: function (entityData, fieldsData, associationsData) {
      const cdsEntities = [];

      for (const entity of entityData) {
        const entityName = entity.name;
        const entityFields = fieldsData.filter(field => field.fld_ID === entity.ID);

        let cdsEntity = `entity ${entityName} {`;

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
            if (targetEntity) {
              cdsEntity += `\n\tfld : Association to ${targetEntity.name};`;
            }
          }

          if (isManyToOne && isTargetEntity) {
            const sourceEntity = entityData.find(e => e.ID === association.entitySource_ID);
            if (sourceEntity) {
              const lowersourceEntity = sourceEntity.name.toLowerCase();
              cdsEntity += `\n\t${lowersourceEntity} : Association to many ${sourceEntity.name}`;

              cdsEntity += `\ton ${lowersourceEntity}.fld = $self;`;
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
    /////////////////////////////////////////////////////////////////////////
    UIgen: function () {
      var entityName = this.test;

      console.log("tttttttttttttttttttttttttttttttttt", entityName)
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


                // Associez les champs aux entités
                entities.forEach(entity => {
                  if (entityName == entity.name) {

                    const entityFields = fields.value.filter(field => field.fld_ID === entity.ID);
                    let annotationSyntax = `annotate service.${entityName} with @(`;
                    annotationSyntax += `\n    UI.FieldGroup #GeneratedGroup : {`;
                    annotationSyntax += `\n        $Type : 'UI.FieldGroupType',`;
                    annotationSyntax += `\n        Data : [`;

                    entityFields.forEach((field) => {
                      annotationSyntax += `\n            {`;
                      annotationSyntax += `\n                $Type : 'UI.DataField',`;
                      annotationSyntax += `\n                Label : '${field.value}',`;
                      annotationSyntax += `\n                Value : ${field.value},`;
                      annotationSyntax += `\n            },`;
                    });

                    annotationSyntax += `\n        ],`;
                    annotationSyntax += `\n    },`;
                    annotationSyntax += `\n    UI.Facets : [`;
                    annotationSyntax += `\n        {`;
                    annotationSyntax += `\n            $Type : 'UI.ReferenceFacet',`;
                    annotationSyntax += `\n            ID : 'GeneratedFacet1',`;
                    annotationSyntax += `\n            Label : 'General Information',`;
                    annotationSyntax += `\n            Target : '@UI.FieldGroup#GeneratedGroup',`;
                    annotationSyntax += `\n        },`;
                    annotationSyntax += `\n    ],`;
                    annotationSyntax += `\n    UI.LineItem : [`;

                    entityFields.forEach((field) => {
                      annotationSyntax += `\n        {`;
                      annotationSyntax += `\n            $Type : 'UI.DataField',`;
                      annotationSyntax += `\n            Label : '${field.value}',`;
                      annotationSyntax += `\n            Value : ${field.value},`;
                      annotationSyntax += `\n        },`;
                    });

                    annotationSyntax += `\n    ],`;
                    annotationSyntax += `\n);`;
                    console.log(annotationSyntax);
                    this.onAppendUIToFilePress(`using modelsService as service from '../../srv/services';` + annotationSyntax);


                  }

                });


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

    onAppendTextToFilePress: function(data) {
      var oMainModel = this.getOwnerComponent().getModel("mainModel");
      var oAction = oMainModel.bindContext("/appendTextToFile(...)");
      oAction.setParameter('content', data);
      oAction.execute().then(
        function () {
            MessageToast.show("Invoice created for sales order ");
        },
        function (oError) {
            MessageToast.show("Error!!! ");
        });
  },
  
  _fnFetchResult: async function(oResult) {
      var header = oResult.headers.get('content-type');
      var isJson = header.includes('application/json');
      var data = isJson ? await oResult.json() : null;
      if (!isJson) {
          var error = "No data found";
          sap.ui.core.BusyIndicator.hide();
          throw new Error(error);
      } else {
          return data;
      }
  }
,  
    onAppendServiceToFilePress: function (data) {


      fetch("/odata/v4/models/appendServiceToFile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: data }) // Pass the variable in the request body
      })
        .then(response => response.json())
        .then(data1 => {
          console.log("Action invoked successfully:", data1);
        })
        .catch(error => {
          console.error("Error invoking action:", error);
        });

    }
    ,
    onAppendUIToFilePress: function (data) {
      var path="./clientproject/app"
      var projectname=this.getView().byId("projectname").getValue().toLowerCase(); 
      var fullpath=path+"/"+projectname+"/annotations.cds"
      console.log("aaaa",fullpath)

      fetch("/odata/v4/models/appendUIToFile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: data,path:fullpath }) // Pass the variable in the request body
      })
        .then(response => response.json())
        .then(data1 => {
          console.log("Action invoked successfully:", data1);
          console.log("aaaa",fullpath)
        })
        .catch(error => {
          console.error("Error invoking action:", error);
        });

    }
    ,

    showCDSmodelGenerationPopup: function () {
      var that = this;
      var dialog = sap.m.MessageBox.show(
        "CDS model generated successfully",
        {
          icon: sap.m.MessageBox.Icon.WARNING,
          title: "Confirmation",
          actions: [sap.m.MessageBox.Action.OK],
          onClose: function (oAction) {
            if (oAction === sap.m.MessageBox.Action.OK) {

            }
          }
        }
      );

      dialog.getBeginButton().setEnabled(false);
    },
    showCDSserviceGenerationPopup: function () {
      var that = this;
      var dialog = sap.m.MessageBox.show(
        "service generated successfully",
        {
          icon: sap.m.MessageBox.Icon.WARNING,
          title: "Confirmation",
          actions: [sap.m.MessageBox.Action.OK],
          onClose: function (oAction) {
            if (oAction === sap.m.MessageBox.Action.OK) {

            }
          }
        }
      );
      dialog.getBeginButton().setEnabled(false);
    },

    //////////////////////////////////////////////////// UI
    onOpenAddDialog: function () {
      var oModel = this.getView().getModel("mainModel");
      var oDialog = this.getView().byId("mainDialog");
      oDialog.open();
      var oModela = new sap.ui.model.json.JSONModel();
    
      console.log(this.table);
      var sUrl1 = oModel.sServiceUrl + "/Entity";
      var sUrl2 = oModel.sServiceUrl + "/Association";
    
      var table4 = [];
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
            var table3 = [];
            this.table.forEach(tableItem => {
              var matchingEntity = entities.find(entity => entity.name === tableItem);
              if (matchingEntity) {
                table3.push(matchingEntity);
              }
            });
            
            console.log("table3", table3);
            fetch(sUrl2) // Ensure sUrl2 is correctly formatted to access the Association entity set
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(data => {
                const associations = data.value;
                associations.forEach(element => {
                  table3.forEach(t => {
                    console.log("Association ID:", element.entityTarget_ID);
                    console.log("Entity ID:", t.ID);
                    if (element.entityTarget_ID == t.ID && element.type=="ManyToOne") {
                      console.log("Match found. Adding association:", element.name);
                      table4.push(t.name);
                    }
                  });
                });
                console.log("table4", table4);
                var aEntityData = table4.map(function(sItem) {
                  return {
                    name: sItem
                  };
                });
    
                // Set the data to the model
                oModela.setData({ Entity: aEntityData });
                console.log(oModela);
                oDialog.setModel(oModela, "rahmaModel");
              })
              .catch(error => {
                console.error("Error retrieving associations:", error);
              });
          })
          .catch(error => {
            console.error("Error retrieving entities:", error);
          });
      } else {
        console.error("Model 'mainModel' is not defined or accessible in the view.");
      }
    },
    
    onSelectChange: function (oEvent) {
      var oSelectedItem = oEvent.getParameter("selectedItem");

      if (oSelectedItem) {

        var sSelectedText = oSelectedItem.getText();
        this.test = sSelectedText;
        this.generateService2(this.test);
        console.log("ttttttt0", this.test)

        console.log("Selected Text:", sSelectedText);
      } else {
        console.log("No item selected.");
      }
    },

    onCancelDialog: function (oEvent) {
      this.getView().byId("mainDialog").close();
      var oView=this.getView()
      var aInputs = [oView.byId("projectname"), oView.byId("apptitle"),oView.byId("namespace"),oView.byId("appdesc")];
       aInputs.forEach((oInput) => { 
        oInput.setValue("")
    });
      
    },

    onOpenAddDialog1: function () {
      this.getView().byId("mainDialog1").open();
    },
    onCancelDialog1: function (oEvent) {
      this.getView().byId("mainDialog1").close();
    },

    onOpenAddDialog3: function () {
      this.getView().byId("mainDialog3").open();
    },
    onCancelDialog3: function (oEvent) {
      this.getView().byId("mainDialog3").close();
     
    },
    onExecuteCommandPress: function (data) {

      var oView = this.getView();

       var Nameproj =oView.byId("projectname").getValue().toLowerCase();
       var apptitle =oView.byId("apptitle").getValue().toLowerCase();
       var namespace =oView.byId("namespace").getValue().toLowerCase();
       var appdesc =oView.byId("appdesc").getValue().toLowerCase();
       var Yocommand = "/home/user/projects/pfe/clientproject/yoListreport.sh " + Nameproj + " " + apptitle + " " + namespace + " " + appdesc;
  

       fetch("/odata/v4/models/ExecuteCommand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: Yocommand }) // Pass the variable in the request body
      })
        .then(response => {
          response.json();
          console.log("Action invoked successfully:uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");

          this.UIgen();
        
        })
        .catch(error => {
          console.error("Error invoking action:", error);
        });

    },
    onExecuteCommandPressCustomPage: function (data) {

      var oView = this.getView();

       var Nameproj =oView.byId("custompage").getValue().toLowerCase();
       var apptitle =oView.byId("customtitle").getValue().toLowerCase();
       var namespace =oView.byId("customnamespace").getValue().toLowerCase();
       var appdesc =oView.byId("customappdesc").getValue().toLowerCase();
       var Yocommand = "/home/user/projects/clientproject/customtemp.sh " + Nameproj + " " + apptitle + " " + namespace + " " + appdesc;
       var aInputs = [oView.byId("custompage"), oView.byId("customtitle"),oView.byId("customnamespace"),oView.byId("customappdesc")];





      fetch("/odata/v4/models/ExecuteCommand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: Yocommand }) // Pass the variable in the request body
      })
        .then(response => {
          response.json();
          console.log("Action invoked successfully:uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
          aInputs.forEach((oInput) => { 
            oInput.setValue("")
        });
        })
        .catch(error => {
          console.error("Error invoking action:", error);
        });

    },
    onExecuteCommandPressBasicPage: function (data) {

      var oView = this.getView();
      var Viewname =oView.byId("viewname").getValue().toLowerCase();

       var Nameproj =oView.byId("basicname").getValue().toLowerCase();
       var apptitle =oView.byId("basicapptitle").getValue().toLowerCase();
       var namespace =oView.byId("basicnamespace").getValue().toLowerCase();
       var appdesc =oView.byId("basicappdesc").getValue().toLowerCase();
       var Yocommand = "/home/user/projects/pfe/clientproject/basictemp.sh " + Viewname+" "+ Nameproj + " " + apptitle + " " + namespace + " " + appdesc;
       var aInputs = [oView.byId("viewname"), oView.byId("basicname"),oView.byId("basicapptitle"),oView.byId("basicnamespace"),oView.byId("basicappdesc")];





      fetch("/odata/v4/models/ExecuteCommand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: Yocommand }) // Pass the variable in the request body
      })
        .then(response => {
          response.json();
          console.log("Action invoked successfully:uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
          this.UIgen();
        })
        .catch(error => {
          console.error("Error invoking action:", error);
        });

    },








  });
}


);