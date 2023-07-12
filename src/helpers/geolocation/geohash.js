import geohash from "ngeohash";
import turf from 'turf'

// Geo and GeoHashes Functions

export const getBoundingBox = (latitude, longitude, distance) => {
    const point = turf.point([longitude, latitude])
    const buffered = turf.buffer(point, distance)
    // bbox => [min_longitude, min_latitude, max_longitude, max_latitude)
    const bbox = turf.bbox(buffered)
    return bbox
};


// Calculate the upper and lower boundary geohashes for
// a given latitude, longitude, and distance in miles
export const getGeohashRange = (latitude, longitude, distance, precision = 7) => {

    const bbox = getBoundingBox(latitude, longitude, distance)
    const lower = geohashEnconde(bbox[1], bbox[0], precision)  ;
    const upper = geohashEnconde(bbox[3], bbox[2], precision);

    return {lower, upper}
};

export const getGeohashNeighborsFromCoordinates = (latitude, longitude, precision = 3) =>{
    const geoHash = geohashEnconde(latitude, longitude, precision = 3)
    return getGeohashNeighbors(geoHash)
}

export const getGeohashNeighbors = (geoHash) =>{
    return geohash.neighbors(geoHash)
}


export const geohashEnconde = (latitude, longitude, precision=7) =>{
    // 1	≤ 5,000km	×	5,000km
    // 2	≤ 1,250km	×	625km
    // 3	≤ 156km	×	156km
    // 4	≤ 39.1km	×	19.5km
    // 5	≤ 4.89km	×	4.89km
    // 6	≤ 1.22km	×	0.61km
    // 7	≤ 153m	×	153m
    // 8	≤ 38.2m	×	19.1m
    // 9	≤ 4.77m	×	4.77m
    // 10	≤ 1.19m	×	0.596m
    // 11	≤ 149mm	×	149mm
    // 12	≤ 37.2mm	×	18.6mm

    return geohash.encode(latitude, longitude, precision)
}

export const geohashDecode = (geohash) =>{
    return geohash.decode(geohash)
}
