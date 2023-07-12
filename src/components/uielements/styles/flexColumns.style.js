import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from "settings/withDirection";

const flexColumnsWrapper = styled.div`
   
  /*  SECTIONS  ============================================================================= */
  
  .section {
      clear: both;
      padding: 0px;
      margin: 0px;
  }
  
  /*  GROUPING  ============================================================================= */
  
  
  .group:before,
  .group:after {
      content:"";
      display:table;
  }
  .group:after {
      clear:both;
  }
  .group {
      zoom:1; /* For IE 6/7 (trigger hasLayout) */
  }
  
  /*  GRID COLUMN SETUP   ==================================================================== */
  
  .col {
      display: block;
      float:left;
      margin: 1% 0 1% 1.6%;
  }
  
  .col:first-child { margin-left: 0; } /* all browsers except IE6 and lower */
  
  
  /*  REMOVE MARGINS AS ALL GO FULL WIDTH AT 480 PIXELS */
  
  @media only screen and (max-width: 480px) {
      .col { 
          margin: 1% 0 1% 0%;
      }
  }
  
    /*  GRID OF TWO   ============================================================================= */
  
  
  .span_2_of_2 {
      width: 100%;
  }
  
  .span_1_of_2 {
      width: 49.2%;
  }
  
  /*  GO FULL WIDTH AT LESS THAN 480 PIXELS */
  
  @media only screen and (max-width: 480px) {
      .span_2_of_2 {
          width: 100%; 
      }
      .span_1_of_2 {
          width: 100%; 
      }
  }
  
  /*  GRID OF THREE   ============================================================================= */
  
      
  .span_3_of_3 {
      width: 100%; 
  }
  
  .span_2_of_3 {
      width: 66.13%; 
  }
  
  .span_1_of_3 {
      width: 32.26%; 
  }
  
  
  /*  GO FULL WIDTH AT LESS THAN 480 PIXELS */
  
  @media only screen and (max-width: 480px) {
      .span_3_of_3 {
          width: 100%; 
      }
      .span_2_of_3 {
          width: 100%; 
      }
      .span_1_of_3 {
          width: 100%;
      }
  } 
    
   
`;

export default WithDirection(flexColumnsWrapper);