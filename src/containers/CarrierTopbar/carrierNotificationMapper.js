import { epochToDateString } from "helpers/data/datetime";
import React from 'react'

export const objectToNotificationArr = (obj) => {
    return Object.keys(obj).map((key) => {
      return { 
        company_account: obj[key].company_account,
        user_account: obj[key].user_account,
        profile: obj[key].profile,
        type: obj[key].type,
        scope: obj[key].scope,
      }
    })
  }


  export const mapShipmentAssignedToUserNotificationToMessageMap = (notification, intl) => {
    const href = `/carrier/shipments/${notification.profile?.shipment?.id}`;
    const title = ( <h5>
           {intl.formatMessage({
               id: `${notification.profile.title}`,
           })}
         </h5>);
       
    const message = (<p>
       <div>
         <strong>Origin</strong>: {`${notification.profile?.shipment?.origin?.location?.address?.city}, ${notification.profile?.shipment?.origin?.location?.address?.state}`}, { epochToDateString(notification.profile?.shipment?.pickup_date?.seconds) }
       </div>
      <div>
       <strong>Destination</strong>:{`${notification.profile?.shipment?.destination?.location?.address?.city}, ${notification.profile?.shipment?.destination?.location?.address?.state}`}, { epochToDateString(notification.profile?.shipment?.drop_off_date?.seconds) }
      </div>
      <div>
        <a  href={href}>
          {intl.formatMessage({id:'general.see_details' })}</a>
      </div>
    </p>);
    
     return {title:title, message:message, href:href}
  }

  

  export const  carrierNotificationToMessageMapper = (notification, intl) => {  
    if (notification){
      return mapShipmentAssignedToUserNotificationToMessageMap(notification, intl)
    }else{
      return ({title:notification.profile?.title || "" , message: notification.profile?.message || "" })
    }
  }

