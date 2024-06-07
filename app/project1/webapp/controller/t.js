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
        entities=data.value;
        const entityWithID = entities.find(entity => entity.ID === this.ID2);
  
      })
      .catch(error => {
        console.error("Error:", error);
      });
  } else {


    console.error("Main model not found");
  }
