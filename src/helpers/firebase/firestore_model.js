export const mapFirestoreResultsToModelList = (firebaseResults, ModelClass, toMap = false, validate = true) => {

    const results = toMap ? {} : []

    Object.keys(firebaseResults).forEach((id) => {
            const new_obj = new ModelClass(id, firebaseResults[id])
            let is_valid = true
            try {
                is_valid = validate ? new_obj.isValid() : ""
            } catch (e) {
                console.error(`{ModelClass} has not is_valid() method`)
            }
            if (is_valid) {
                if (toMap) {
                    results[id] = new_obj
                } else {
                    results.push(new_obj)
                }
            }
        }
    )
    return results
}

export const docToModel = (doc, ModelClass) => {
    return  new ModelClass(doc.id, doc.data())
}

export const mapQuerySnapshotToModel = (querySnapshot, ModelClass, toMap = false, validate = true) => {

    const results = toMap ? {} : []
    querySnapshot.forEach(function (doc) {
        if (doc.exists) {
            const new_obj = docToModel(doc, ModelClass)
            let is_valid = true
            try {
                is_valid = validate ? new_obj.isValid() : false
            } catch (e) {
                console.error(`{ModelClass} has not is_valid() method`)
            }
            if (is_valid) {
                if (toMap) {
                    results[doc.id] = new_obj
                } else {
                    results.push(new_obj)
                }
            }
        } else {
            console.log("No such document!");
        }
    })
    return results
}