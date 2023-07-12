

export class DataConfig {
    constructor(data) {
        this.unit = data.unit
        this.unitInPrefix = data.unitInPrefix || false
        this.label = data.label
        this.decimals = data.decimals
    }
}

export function translate(key, intl){
    try{
        return intl.formatMessage({id: key})
    }catch (e) {
        console.error(`error translating ${key} : ${e.message}`)
        return key
    }
}

/* Map a set of {key: val}  to {key : {label: "Label", value: "value unit"
*   @param data: {key: val}
*   @param dataConfig: {key: DataConfig}  specifying data config for each key taken from program configurations
*   @param userConfig: {key: DataConfig}   specifying data config for each key taken from user configurations
*   @return {key: {label:"", value: ""}}
* example: data = {temp: 4} =>  data = {temp: {label: "Temperature", value: "4 Celcius"}}
 */
export function mapData(data, dataConfigs={}, userConfigs={},options={}, intl){
    // TODO: implement using userConfig

    const results = {}
    Object.keys(data).forEach(key => {
        const result = {}
        const value = data[key]
        const dataConfig = dataConfigs[key]
        if (dataConfig){
            result.label =  dataConfig.label
            if (intl){
                result.label = translate(dataConfig.label, intl)
            }
            result.value = value
            if (dataConfig.decimals){
                try{
                    result.value = result.value.toFixed(dataConfig.decimals);
                }catch (e) {
                    console.error(`Error applying decimal to ${key} value: ${e.message}`);
                }
            }
            if (dataConfig.unit){
                const unitStr = intl ? translate(dataConfig.unit, intl) : dataConfig.unit
                //TODO: convert unit to user units if different in userConfig.
                result.value=  dataConfig.unitInPrefix ? `${unitStr} ${result.value}`: `${result.value} ${unitStr}`
            }
            results[key] = result
        }else{
            results[key] = {label: key, value: data[key]}
        }
    })
    return results
}

//data = {temp: 4} =>  data = {temp: {label: "Temperature", value: "4 Celcius"}}