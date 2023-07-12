import React from "react";
import InfoBubbleComponent from "./InfoBubble.style.";
import Popover from "../uielements/popover"
import {InfoCircleOutlined} from "@ant-design/icons"

const infoBubble = (props) => (
  <InfoBubbleComponent>
      <Popover title={props.title} content={props.content}> 
        <InfoCircleOutlined />
      </Popover>
  </InfoBubbleComponent>
);

export default infoBubble