import {epochToDateString} from "helpers/data/datetime";
import React from "react";
import {Col, Row} from 'antd';


const shipmentAssignedToUserNotification = (notification, intl) => {
  const title = ( <h5>{intl.formatMessage({id: 'notification.user_assigned_to_shipment.title'})}</h5>);
  const shipment = notification.associated_resources?.shipment || {}
  const shipmentProfile = shipment.profile ?? {}
  const shipmentId = shipment.id ?? ''
  const shipmentHref = `/carrier/shipments/${shipmentId}`;
  const originEpoch = shipmentProfile.origin?.access_time?.earliest_time?.seconds
  const destinationEpoch = shipmentProfile.destination?.access_time?.earliest_time?.seconds
  const originTime = originEpoch ? epochToDateString(originEpoch) : ""
  const destinationTime = destinationEpoch ? epochToDateString(destinationEpoch) : ""
  const origin_address = `${shipmentProfile.origin?.location?.address?.city}, ${shipmentProfile.origin?.location?.address?.state}`
  const destination_address = `${shipmentProfile.destination?.location?.address?.city}, ${shipmentProfile.destination?.location?.address?.state}`
  const shipmentName = `${intl.formatMessage({id: 'general.shipment'})}: ${shipmentId || ""}`
  const user = notification.associated_resources?.user ?? {}
  const userId = user?.id ?? ''
  const userProfile = user.profile ?? {}
  const userName = `${userProfile.first_name} ${userProfile.last_name}`
  const userHref = `/carrier/users/${userId}`

  const content = (<Row justify="space-around">
    <Col span={14}>
      <div>
        <a href={userHref}> {userName}</a> has been assigned to: <a  href={shipmentHref}> {shipmentName}</a>
      </div>
    </Col>
    <Col span={10}>
      <div>
        <strong>{intl.formatMessage({id: 'location.origin'})}</strong>: {origin_address}, { originTime}
      </div>
      <div>
        <strong>{intl.formatMessage({id: 'location.destination'})}</strong>:{destination_address}, { destinationTime }
      </div>
    </Col>

  </Row>);

  return {title:title, content:content, href:shipmentHref}
};

const notificationToMessageMap = {
  shipment_assigned_to_user_notification: shipmentAssignedToUserNotification
}
export default notificationToMessageMap;