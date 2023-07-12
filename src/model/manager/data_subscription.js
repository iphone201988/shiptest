export const setCollectionSubscription = (CollectionClass, dataContainer ,conditions=[] ) => {
  try{
    if (CollectionClass && CollectionClass.collection){
      CollectionClass.collection.query(conditions, (results) => {
        const newData =  {}
        results.forEach(result =>  {
          newData[result.id] = new CollectionClass(result.id, result)
        })
        dataContainer = newData
      }, true)
    }
  }catch (e) {
    console.error(e.message)
  }
}