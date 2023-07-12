import styled from "styled-components";
import { palette } from 'styled-theme';
import WithDirection from "settings/withDirection";
// import HomeHeaderImage from "images/homeheader.png";
// import ShipperHeaderImage from "images/9652956.jpeg"  // 9652956.jpeg  192810168_2.jpeg";  // 41332975_2
import ShipperHomeImage1 from "images/190214744.jpeg"
import CarrierHomeImage1 from "images/225586230.jpeg"
// import CarrierHeaderImage from "images/12733338.jpeg";
import truck1Image from "images/101902599.jpeg";
import trucks1Image from "images/225586230.jpeg";
// import enhancedShippingImage from "images/121322946.jpeg";
import shippingManagementImage from "images/130505879.png";
import FreightServiceIconImage from "images/icons/shipped.png";

let dark_bleu_transparent_home = "rgba(0, 21, 40, 0.5)"
let dark_bleu_transparent_carrier = "rgba(0, 21, 40, 0.2)"
let dark_bleu_home = "rgba(0, 21, 40, 1)"
let dark_bleu_carrier = "rgba(0, 21, 40, 0.9)"
let blue_color_1 = "#013CF9"
let bleu_color_2 = "#223cf9"
let orange_color_1 = "#DB8701"//"#F99D01"
let yellow_color_1 = "#eea501" //"#F9BE01"
let white_color = "#ffffff"
let black_text_color = "#000000"
let light_grey_color = "#F3F3F2";
let red_color_1 = "#bb2101" // "#F92A01"
let light_blue = "#7B9AFE"

// FORMUlA FOR Font-size  calc([minimum size] + ([maximum size] - [minimum size]) * ((100vw - [minimum viewport width]) / ([maximum viewport width] - [minimum viewport width])));

let header_background = white_color
let content_background = light_grey_color
let button_background_color = orange_color_1
let feature_card1_background = blue_color_1
let feature_card1_color = white_color

let button_text_color = "#000000"
let header_title_color = "#000000"
let content_title_color = "#000000"
let content_text_color = "#000000"

const DashboardLayoutWrapper = styled.div`
 
  .contentSection1{
    height: 300px;
  }
  
  .contentClass{
    background-color: ${content_background};
    width: 100%;
    color: rgba(0,0,0,1) !important;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 15px;
    size: 14px;
  }
  
   /*  SECTIONS  ============================================================================= */

  .section {
      clear: both;
      padding: 10px;
      margin: 0px;
  }
  
  .section h3{
    
    font-size: 30px;
    text-align: center;
    font-weight: 600;
    
  }
  
  .section p{
    padding: 10px 30px 10px 30px;
    font-size: 18px;
    color: ${content_text_color};
  }
  
  .section1 h3{
    color: ${blue_color_1};
  }
  
  .section2 h3{
    color: ${red_color_1};
  }
  
    
  .subsection{
     padding-top: 16px;
     padding-bottom: 5px;
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
      // margin: 0 0 1% 1.6%;
  }

  .col:first-child { margin-left: 0; } /* all browsers except IE6 and lower */
  
  .col h2{
    color: ${content_title_color};
    font-size: 24x;
    text-align: center;
    @media only screen and (max-width: 767px) {
       font-size: 18px;
     }
  }
  
  .col h3{
    color: ${content_title_color};
    font-size: 35px;
    font-weight: 600;
    text-align: center;
    padding-bottom: 5px;
    padding-top: 10px
    @media only screen and (max-width: 767px) {
       font-size: 26px;
       padding-bottom: 5px;
     }
  }
  
  .col h4{
    color: ${content_title_color};
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    padding-bottom: 5px;
    @media only screen and (max-width: 767px) {
       font-size: 16px;
       padding-bottom: 10px;
     }
  }
  
  .col p {
     font-size: 16px;
     color: ${content_title_color};
     padding: 5px 15px 5px 15px;
  }


  /*  REMOVE MARGINS AS ALL GO FULL WIDTH AT 670 PIXELS */

  @media only screen and (max-width: 670px) {
      .col { 
          margin: 1% 0 1% 0%;
      }
  }

    /*  GRID OF TWO   ============================================================================= */

  .span_1_of_1 {
      width: 100%;
  }

  .span_2_of_2 {
      width: 100%;
  }

  .span_1_of_2 {
      width: 49.2%;
  }

  /*  GO FULL WIDTH AT LESS THAN 670 PIXELS */

  @media only screen and (max-width: 670px) {
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


  /*  GO FULL WIDTH AT LESS THAN 670 PIXELS */

  @media only screen and (max-width: 670px) {
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
  
  /*  GRID OF FOUR   ============================================================================= */

  .span_4_of_4 {
      width: 100%; 
  }

  .span_3_of_4 {
      width: 74%; 
  }

  .span_2_of_4 {
      width: 49%; 
  }

  .span_1_of_4 {
      width: 24%; 
  }


  /*  GO FULL WIDTH AT LESS THAN 670 PIXELS */
  @media only screen and (max-width: 670px) {
      .span_4_of_4 {
          width: 100%; 
      }
      .span_3_of_4 {
          width: 49%; 
      }
      .span_2_of_4 {
          width: 100%; 
      }
      .span_1_of_4 {
          width: 49%;
      }
  } 
  
  @media only screen and (max-width: 370px) {
      .span_4_of_4 {
          width: 100%; 
      }
      .span_3_of_4 {
          width: 100%; 
      }
      .span_2_of_4 {
          width: 100%; 
      }
      .span_1_of_4 {
          width: 100%;
      }
  } 
  
  /*  GRID OF FIVE   ============================================================================= */
  .span_5_of_5 {
      width: 100%; 
  }
  .span_4_of_5 {
      width: 79%; 
  }
  .span_3_of_5 {
      width: 59%; 
  }
  .span_2_of_5 {
      width: 39%; 
  }
  .span_1_of_5 {
      width: 19%; 
  }


  /*  GO HALFT WIDTH AT LESS THAN 670 PIXELS */

  @media only screen and (max-width: 670px) {
      .span_4_of_5 {
          width: 100%; 
      }
      .span_4_of_4 {
          width: 65%; 
      }
      .span_3_of_4 {
          width: 32%; 
      }
      .span_2_of_4 {
          width: 100%; 
      }
      .span_1_of_4 {
          width: 49%;
      }
  } 
  
  .content_shipper_image1{
    background: url(${ShipperHomeImage1}) no-repeat center center;
    background-size: cover;
    height: 270px;
    margin-left: 15px;
    margin-right: 15px;
  }
  
  .content_carrier_image1{
    background: url(${CarrierHomeImage1}) no-repeat center center;
    background-size: cover;
    height: 270px;
    margin-left: 15px;
    margin-right: 15px;
  }
  
  .truck1{
    background: url(${truck1Image}) no-repeat center center;
    background-size: cover;
    height: 150px;
  }
  
  .trucks1{
    background: url(${trucks1Image}) no-repeat center center;
    background-size: cover;
    height: 250px;
  }
  
  .shippingManagement{
    background: url(${shippingManagementImage}) no-repeat center center;
    background-size: cover;
    height: 450px;
  }
  
  .FreightServiceIcon{
    background: url(${FreightServiceIconImage}) no-repeat center center;
    background-size: auto;
    height: 40px;
  }
  
  
  .AccordionHeader{
  }
  
  .AccordionHeaderText{
    padding: 5px;
    font-size: 21px;
     @media only screen and (max-width: 670px) {
      font-size: 16px;
     }
     @media only screen and (max-width: 480px) {
      font-size: 14px;
     }
  }
  
  AccordionBodyText{
    font-size: 18px;
    @media only screen and (max-width: 670px) {
      font-size: 14px;
    }
    
    @media only screen and (max-width: 480px) {
      font-size: 13px;
    }
  }
  
  .FeatureIcon64{
    margin-left: calc(50% - 32px);
    width: 64px;
    height: 78px;
  }
  
  
`

export default WithDirection(DashboardLayoutWrapper);