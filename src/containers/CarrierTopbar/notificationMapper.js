import { carrierNotificationToMessageMapper } from "./carrierNotificationMapper";

const domainDataMap = {
    carrier: {
        shipment_assigned_to_user_notification:carrierNotificationToMessageMapper
    },
    shipping:{},
    admin:{},
}

export const notificationDomainTypeFilter = (notification, intl, domain) => {
    
    const domainMapper = domainDataMap[domain][notification.type]
    if(domainMapper){
        return domainMapper(notification,intl);
    }
    return {} ;
}
