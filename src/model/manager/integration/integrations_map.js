const KTConfig =  require("./providers/kt/config").default;
const KeepTruckingAPI = require("./providers/kt/api").default;

export const INTEGRATION_CATEGORIES = {
    telematics: {
        'name': 'integration.type.telematics',
        'description': 'integration.type.telematics.description'
    },
    tms: {
        'name': 'integration.type.tms',
        'description': 'integration.type.tms.description'
    },
    loadboard: {
        'name': 'integration.type.loadboard',
        'description': 'integration.type.loadboard.description'
    }
}

export const AUTH_METHODS = {
    oauth2 : {}
}

export const INTEGRATION_STATUS = {
    active: {
        name: 'general.active',
        color: "green",
    },
    deactivated: {
        name: 'general.deactivated',
        color: "red",
    }
}

export const INTEGRATION_PROVIDERS = {
    keeptruckin : {
        name: "integration.provider.keeptrucking",
        description: "integration.provider.keeptrucking.description",
        category: "telematics",
        auth_method: "oauth2",
        api: new KeepTruckingAPI(KTConfig),
        scopes: KTConfig.scopes || [],
        config: KTConfig
    }
}

export function getIntegrationProvider(key){
    return INTEGRATION_PROVIDERS[key] || {name: "N/A"}
}

export function getIntegrationCategory(key){
    return INTEGRATION_CATEGORIES[key] || {name: "N/A"}
}

export function integration_status(key){
    return INTEGRATION_STATUS[key] || {name: "N/A"}
}
