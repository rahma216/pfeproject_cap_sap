entityData .forEach(entity => {
  if (entityName == entity.name) {
    this.test2=entity.annotations;
    console.log("aaaah.",this.test2);
  }

});