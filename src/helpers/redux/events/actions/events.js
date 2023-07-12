import Event from "model/event/event"

export const fetchEvents = (conditions) => async dispatch => {

    try{
        const Ref = Event.collection.queryRef(conditions)
        Ref.onSnapshot((querySnapshot) => {
          console.log('redux querySnapshot:', querySnapshot)
          //const results = mapQuerySnapshotToModel(querySnapshot, Event)
            //dispatch({type: FETCH_EVENTS, payload: results});
        }, function(error) {console.log("Error getting documents: ", error);});
    }
    catch (e) {
        console.error(e.message)
    }
};