export const fetchCollection = (type, CollectionClass, conditions, dispatch) => {

  try{
    if (CollectionClass && CollectionClass.collection){

      if (typeof(conditions) === 'string'){
        // is an id
        CollectionClass.collection.get(conditions, (result) => {
          return dispatch({type: type, payload: result});
        }, true)
      }else{
        //if a query
        CollectionClass.collection.query(conditions, (results) => {
          const resultsObjects =  {}
          results.forEach(result =>  {
            resultsObjects[result.id] = new CollectionClass(result.id, result)
          })
          return dispatch({type: type, payload: resultsObjects});
        }, true)
      }

    }
  }catch (e) {
    console.error(e.message)
  }
};