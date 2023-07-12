import styled from "styled-components";
import WithDirection from "settings/withDirection";

import OpportunityIconImage from "images/icons/opportunities.png"
import TrackingIconImage from "images/icons/track_64.png"
import BusinessIconImage from "images/icons/business.png"
import TimeMoneyIconImage from "images/icons/time_money.png"
import MobileNavigationIconImage from "images/icons/mobile_navigation.png"


const CarrierLayoutWrapper = styled.div`
  .OpportunityIcon{
     background: url(${OpportunityIconImage}) no-repeat center center;
  }
  .TrackingIcon{
     background: url(${TrackingIconImage}) no-repeat center center;
  }
  .BusinessIcon{
     background: url(${BusinessIconImage}) no-repeat center center;
  }
  .TimeMoneyIcon{
     background: url(${TimeMoneyIconImage}) no-repeat center center;
  }
  .MobileNavigationIcon{
     background: url(${MobileNavigationIconImage}) no-repeat center center;
  }
`

export default WithDirection(CarrierLayoutWrapper);