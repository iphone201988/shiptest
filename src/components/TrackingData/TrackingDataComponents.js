import React from "react";

/**
 * Return Tags  RxJS code - given a data, and data config
 * More description continues here.
 */
import {mapData} from "helpers/components/data_helpers/data_components";


export function DataElements(data, dataConfigs, userConfigs={}, options={}, intl=undefined, Element= "div", ElemProps){

    const trackingData = mapData(data, dataConfigs, userConfigs, options, intl)
    const tags = Object.values(trackingData).map(value => (<Element {... ElemProps}>{`${value.label || ""}: ${value.value || ""} `}</Element>))
    return tags
}