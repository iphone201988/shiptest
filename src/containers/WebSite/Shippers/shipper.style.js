import styled from "styled-components";
import WithDirection from "settings/withDirection";

import OpportunityIconImage from "images/icons/opportunities.png"
import TrackingIconImage from "images/icons/track_64.png"
import BusinessIconImage from "images/icons/business.png"
import TimeMoneyIconImage from "images/icons/time_money.png"
import MobileNavigationIconImage from "images/icons/mobile_navigation.png"
import LoadingTrucksSmallImage from "images/172784754_small.jpeg"
import QualityMonitoringIconImage from "images/icons/quality_monitoring.png"
import ManagementIconImage from "images/icons/management.png"



const ShipperLayoutWrapper = styled.div`

  .LoadingTrucksSmall{
    background: url(${LoadingTrucksSmallImage}) no-repeat center center;
  }
  
  
  .QualityMonitoringIcon{
     background: url(${QualityMonitoringIconImage}) no-repeat center center;
  }
  .ManagementIcon{
     background: url(${ManagementIconImage}) no-repeat center center;
  }
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
export default WithDirection(ShipperLayoutWrapper);