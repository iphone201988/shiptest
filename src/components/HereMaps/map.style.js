import WithDirection from "settings/withDirection";
import styled from "styled-components";

const MapWrapper = styled.div`
  .TripSummary{
    font-size: 20px;
    font-weight: 700;
    padding: 10px; 
  }
  
  .here-map img {
    max-width: none;
  }

`

export default WithDirection(MapWrapper);
