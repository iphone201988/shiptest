import firebase from "firebase"


export const getCompanyName = async (companyId) => {
    const db = firebase.firestore()
    const companyRef = db.collection('Companies').doc(companyId)
    const company = await companyRef.get()
    const companyName = company.data().profile.name		

    return companyName
}

