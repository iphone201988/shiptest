import firebase from "firebase";
import { geohashEnconde, getGeohashNeighbors, getGeohashRange } from "../../geolocation/geohash";
import { docToModel, mapQuerySnapshotToModel } from "../firestore_model";
import { handleHttpError } from "../../error/errors";
import { emulator } from "settings";

const geofirex = require("geofirex");
const geo = geofirex.init(firebase);
const h3 = require("h3-js");

const db = firebase.firestore()

if (emulator) {
    db.useEmulator("localhost", 8080);
}
class QueryCondition {

    apply(queryRef) {
        return queryRef
    }
}
export class FireQuery extends QueryCondition {
    // for Firebase Query conditions
    constructor(field, operator, value) {
        super()
        this.field = field
        this.op = operator
        this.val = value

    }

    apply(queryRef) {

        return queryRef.where(...[this.field, this.op, this.val])
    }
}

export class FireIdQuery extends QueryCondition {
    // for Firebase Query conditions
    constructor(collection,modelClass, id) {
        super()
        this.id = id
        this.modelClass = modelClass
        this.collection = collection
    }

    apply(queryRef) {
        queryRef = db.collection(this.collection).doc(this.id);
        return queryRef.get().then(function (doc) {
            console.log(doc.data(),"%5555555");
            if (doc.exists) {
                const _this = this;
                const data = doc.data();
                docToModel(doc, _this.modelClass)
                console.log('Document data:', data);
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
    }
}


export class GeoQuery extends QueryCondition {
    //  Firebase Geoquery using geoash ranges
    constructor(field, position, radius = 100) {
        super()
        try {
            const geohash_range = getGeohashRange(position.geopoint.latitude, position.geopoint.longitude, radius)

            this.field = `${field}.geohash`
            this.upper = geohash_range.upper
            this.lower = geohash_range.lower
        } catch (e) {
            console.error("Invalid GeoQuery: " + e.message)
        }

    }
    // f0wt7g9
    apply(queryRef) {
        return queryRef.where(...[this.field, ">=", this.lower]).where(...[this.field, "<=", this.upper])
    }
}

export class H3Query extends QueryCondition {
    //  Firebase Geoquery using geoash ranges
    constructor(field, position, radius = 7) {
        super()
        try {
            switch (radius) {
                case "1":
                    this.field = `${field}.l1`
                    break;
                case "2":
                    this.field = `${field}.l2`
                    break;
                case "3":
                    this.field = `${field}.l3`
                    break;
                case "4":
                    this.field = `${field}.l4`
                    break;
                case "5":
                    this.field = `${field}.l5`
                    break;
                case "6":
                    this.field = `${field}.l6`
                    break;
                case "7":
                    this.field = `${field}.l7`
                    break;
                default:
                    this.field = `${field}.l7`
            }
            const h3Index = h3.geoToH3(position.geopoint.latitude, position.geopoint.longitude, radius);
            const kRing = h3.kRing(h3Index, 1);
            this.kRing = kRing

        } catch (e) {
            console.error("Invalid GeoQuery: " + e.message)
        }

    }
    // f0wt7g9
    apply(queryRef) {
        return queryRef.where(...[this.field, "in", this.kRing])
    }
}

export class GeoFirexQuery extends QueryCondition {
    //  Firebase Geoquery using geoash ranges
    constructor(field, position, radius = 100) {
        super()
        try {
            this.field = `${field}`
            this.center = geo.point(position.geopoint.latitude, position.geopoint.longitude)
            this.radius = radius
        } catch (e) {
            console.error("Invalid GeoQuery: " + e.message)
        }

    }

    apply(queryRef) {
        return geo.query(queryRef).within(this.center, this.radius, this.field);
    }
}

export class ProximityGeoQuery extends QueryCondition {
    /*  Firebase Geoquery using geoash neightboors
       since we cannot combine ranges operations on more than one field
     */

    constructor(field, position, _ = 3) {
        super()
        const precision = 3
        const geoHash = geohashEnconde(position.geopoint.latitude, position.geopoint.longitude, precision)
        const proximityHashes = (getGeohashNeighbors(geoHash) || [])
        proximityHashes.push(geoHash)
        this.proximityHashes = proximityHashes
        this.field = `${field}.geoash_${precision}`

    }

    apply(queryRef) {
        return queryRef.where(...[this.field, "in", this.proximityHashes])
    }
}

export default class FirestoreCollection {

    constructor(collection, modelClass = undefined, base_conditions = []) {
        this.collection = collection
        this.modelClass = modelClass
        this.base_conditions = (Array.isArray(base_conditions)) ? base_conditions : [];
    }

    get = (id, onChange, realtime = false) => {
    console.log("system");
        const docRef = db.collection(this.collection).doc(id);

        if (realtime) {
            let _this = this
            return docRef.onSnapshot(function (doc) {
                onChange(docToModel(doc, _this.modelClass))
            });
        } else {
            let _this = this
            return docRef.get().then(function (doc) {
                if (doc.exists) {
                    if (onChange) {
                        onChange(docToModel(doc, _this.modelClass))
                    }
                } else {
                    console.log("No such document!");
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
        }
    }

    queryRef = (conditions) => {


        let ColRef = db.collection(this.collection)
        conditions = [...conditions, ...(this.base_conditions || [])];

        for (let condition of conditions) {
            if (condition instanceof QueryCondition) {
                ColRef = condition.apply(ColRef)
            }
        }


        return ColRef;
    }

    query = (conditions, onChange = undefined, realtime = false, hasLocationFilters = undefined, order) => {

        let ColRef = this.queryRef(conditions);

        if (realtime) {
            if (hasLocationFilters !== undefined && order == undefined) {
                return ColRef.orderBy(hasLocationFilters).orderBy('last_modified', 'desc').limit(20).onSnapshot((querySnapshot) => {
                    const results = mapQuerySnapshotToModel(querySnapshot, this.modelClass)
                    onChange(results)
                }, function (error) { handleHttpError(error, { throwError: false, logError: true }) });
            }

            if (hasLocationFilters === undefined && order === undefined) {
                return ColRef.orderBy('last_modified', 'desc').limit(20).onSnapshot((querySnapshot) => {
                    const results = mapQuerySnapshotToModel(querySnapshot, this.modelClass)
                    onChange(results)
                }, function (error) { handleHttpError(error, { throwError: false, logError: true }) });
            }

            if (hasLocationFilters === undefined && order !== undefined) {
                return ColRef.orderBy(`${order}`, 'desc').limit(20).onSnapshot((querySnapshot) => {
                    const results = mapQuerySnapshotToModel(querySnapshot, this.modelClass)
                    onChange(results)
                }, function (error) { handleHttpError(error, { throwError: false, logError: true }) });
            }
            if (hasLocationFilters !== undefined && order !== undefined) {
                return ColRef.orderBy(`${order}`, 'desc').limit(20).onSnapshot((querySnapshot) => {
                    const results = mapQuerySnapshotToModel(querySnapshot, this.modelClass)
                    onChange(results)
                }, function (error) { handleHttpError(error, { throwError: false, logError: true }) });
            }

        } else {
            return ColRef.get()
                .then(function (querySnapshot) {
                    const results = []
                    querySnapshot.forEach(function (doc) {
                        if (doc.exists) {
                            results[doc.id] = doc.data()
                        } else {
                            console.log("No such document!");
                        }
                    });
                    if (onChange) {
                        onChange(results)
                    }
                })
                .catch(function (error) {
                    handleHttpError(error, { throwError: true, logError: true })
                });
        }
    }
}

