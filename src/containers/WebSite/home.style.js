import styled from "styled-components";
import WithDirection from "settings/withDirection";
import HomeHeaderImage from "images/46479654.jpeg";
import ShipperHeaderImage from "images/trucks_loading.jpeg"  // 9652956.jpeg  192810168_2.jpeg";  // 41332975_2
import ShipperHomeImage1 from "images/190214744.jpeg"
import CarrierHomeImage1 from "images/225586230.jpeg"
import CarrierHeaderImage from "images/12733338.jpeg";
// import trucks1Image from "images/225586230.jpeg";
// import enhancedShippingImage from "images/121322946.jpeg";
import shippingManagementImage from "images/130505879.png";
import FreightServiceIconImage from "images/icons/shipped.png";
import MobileNavigationIconImage from "images/icons/mobile_navigation.png"
import InnovationIconImage from "images/icons/innovation.png"
import MarketPriceIconImage from "images/icons/market_price.png"

let dark_bleu_transparent_home = "rgba(0, 21, 40, 0.5)"
let dark_bleu_transparent_carrier = "rgba(0, 21, 40, 0.2)"
let dark_bleu_home = "rgba(0, 21, 40, 1)"
let dark_bleu_carrier = "rgba(0, 21, 40, 0.9)"
let blue_color_1 = "#013CF9"
// let bleu_color_2 = "#223cf9"
let orange_color_1 = "#DB8701"//"#F99D01"
let yellow_color_1 = "#eea501" //"#F9BE01"
let white_color = "#ffffff"
let black_text_color = "#000000"
let light_grey_color = "#F3F3F2";
let red_color_1 = "#bb2101" // "#F92A01"
// let light_blue = "#7B9AFE"

// FORMUlA FOR Font-size  calc([minimum size] + ([maximum size] - [minimum size]) * ((100vw - [minimum viewport width]) / ([maximum viewport width] - [minimum viewport width])));


// let header_background = white_color
let content_background = light_grey_color
// let button_background_color = orange_color_1
let feature_card1_background = blue_color_1
let feature_card1_color = white_color

// let button_text_color = "#000000"
let header_title_color = "#000000"
let content_title_color = "#000000"
let content_text_color = "#000000"

const HomeLayoutWrapper = styled.div`
  .headerClass{
    background-color: ${dark_bleu_home};
    background-size: cover;
    width: 100%;
    height: 400px;
    color: #000000;
    padding: 0px;
  }
  
  .HomePageHeaderClass{
  
    background: url(${HomeHeaderImage}) no-repeat center center;
    // background-color: ${dark_bleu_home};
    background-size: cover;
    position:relative;
  }
  
  .HomePageOverHeaderClass{
    background-image: linear-gradient(to right, ${dark_bleu_home}, ${dark_bleu_transparent_home});
    background-color: rgba(0,0,0, 0);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .HomeHeaderTitleWrapper{
     color: ${header_title_color} !important;
     height: 100%;
     width: 98%;
     padding-top: 3vw;
     padding-bottom: 10px;
     padding-left: 5%;
     padding-right: 5%;
     
     @media only screen and (max-width: 900px) {
       padding-left: 28px;
       padding-right: 28px;
     }
     
     @media only screen and (max-width: 670px) {
       padding-left: 22px;
       padding-right: 22px;
     }
     
     @media only screen and (max-width: 480px) {
       padding-left: 15px;
       padding-right: 15px;
     }
  }
  
  .HomeHeaderTitleWrapper h1{
    color: ${white_color};
    width: 100%;
    font-size: min(max(18px, 4vw), 36px);
    line-height: min(max(18px, 4vw), 36px);
    font-weight: 700;
    padding-bottom: 5px;
    padding-top: 20px;
     
  }
  
  .HomeHeaderTitleWrapper h2{
  
    color: ${white_color};
    font-size: min(max(14px, 3.5vw), 26px);
    line-height: min(max(14px, 3.5vw), 26px);
    width: 70%;
    font-weight: 700;
    padding-bottom: 5px;
    padding-top: 20px;
    line-height: 40px;
    
    @media only screen and (max-width: 900px) {
       padding-top: 18px;
       line-height: 36px;
       width: 75%;
     }
     @media only screen and (max-width: 670px) {
       padding-top: 14px;
       width: 85%;
     }
   
    @media only screen and (max-width: 450px) {
       padding-top: 10px;
       width: 95%;
     }
     @media only screen and (max-width: 200px) {
       padding-top: 10px;
       width: 100%;
     }  
  }
  
  .HomeHeaderAction{
    font-size: 1.6vw;
    color: ${white_color};
    text-align: center;
    width: 70%;
    padding-top: 20px;
    padding-left: 5%;
    padding-right: 5%;
    
    @media only screen and (max-width: 900px) {
       // font-size: 28px;
       width: 80%;
    }
    @media only screen and (max-width: 670px) {
       // font-size: 24px;
       width: 90%;
     }
    @media only screen and (max-width: 480px) {
       // font-size: 20px;
       padding-left: 0%;
       padding-right: 0%
       width: 95%;
     }
     
  }
  
  .HomeHeaderAction h1 {
    // font-size: 24px;
  }
  .HomeHeaderAction h2 {
    // font-size: 18px;
  }
 
 
  .ShippingPageHeaderClass{
    background: url(${ShipperHeaderImage}) no-repeat center center;
    background-size: cover;
    position:relative;
  }
  
  .CarrierPageHeaderClass{
    background: url(${CarrierHeaderImage}) no-repeat center center;
    background-size: cover;
    position:relative;
  }
  

  .ShippingPageOverHeaderClass{
   background-image: linear-gradient(to bottom right, ${dark_bleu_carrier}, ${dark_bleu_transparent_carrier});
    // background-color: rgba(0,0,0,0.55);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .CarrierPageOverHeaderClass{
    background-image: linear-gradient(to bottom right, ${dark_bleu_carrier}, ${dark_bleu_transparent_carrier});
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
 
  .headerClass .headerInnerLayout{
    width: 100%;
    height: 100%;
    // background-color: inherit;
  }
  
  .headerInnerSection{
    width: 100%;
    height: 100%;
    text-align: center;
  }
  
  .headerChildren{
    background-color: inherit;
  }
  
   .HeaderButton{
    font-size: 20px;
    font-weight: 700;
    border: none;
    // border-radius: 16px;
    @media only screen and (max-width: 767px) {
      font-size: 15px;
       // border-radius: 30px;
    }
  }
  
  .Blue1Button{
    background-color: ${blue_color_1};
    color: ${white_color};
  }
  
  .Red1Button{
    background-color: ${red_color_1};
    color: ${white_color};
  }
  
  .OrangeButton{
    background-color: ${orange_color_1};
    color: ${white_color};
  }
  
  .Yellow1Button{
    background-color: ${yellow_color_1};
    color: ${black_text_color};
  }
  
 
  
  .HeaderTitleWrapper{
     color: ${header_title_color} !important;
     height: 100%;
     width: 100%;
     display: flex;
     justify-content: center;
     text-align: center;
     padding-left: 10px;
     padding-right: 10px;
  }
  
  .BlueText{
    color: ${blue_color_1} !important;
  }
  
  .FeatureButton{
    
    font-size: 18px;
    font-weight: 550;
    border: none;
    // border-radius: 8px;
    
    @media only screen and (max-width: 767px) {
      font-size: 15px;
    }
  }
  
  .FeaturesTitle{
    font-size: 18px;
    font-weight: 700;
    @media only screen and (max-width: 767px) {
      font-size: 15px;
    }
  }
  
  .FeatureButton1{
    background-color: ${blue_color_1};
    color: ${white_color};
  }
  
  .FeatureButton2{
    background-color: ${orange_color_1};
    color: ${white_color};
  }
  
  .FeatureButton3{
    background-color: ${red_color_1};
    color: ${white_color};
  }
  
  .FeatureCard{
    border-style: solid;
    border-width: 2px;
  }
  
  .FeatureCardTitle{
    text-align: center;
    color: ${black_text_color};
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 30px;
  }
  
  .FeatureCardSubTitle{
    text-align: center;
    color: ${black_text_color};
    font-weight: 500;
    font-size: 1.6rem;
    margin-bottom: 30px;
  }
  
  .FeatureCardBody{
    color: ${black_text_color};
    font-size: 19px;
    padding: 10px 10px; 
  }
  
  .FeatureCardBodyText{
    padding-top: 30px;
    padding-bottom: 30px;
  }
  
  .FeatureCard1{
    color: ${feature_card1_background};  
  }
  
  .FeatureCardHeader1{
    background-color: ${feature_card1_background} !important; 
    color: ${feature_card1_color} !important;
    
  }
  
  .FeatureCardBody1{
    color: ${feature_card1_background};
    margin-left: 10px;
    margin-right: 10px;
  }
  
  
  .ShippingHeaderTitleWrapper{
  }
 
  .ShippingHeaderTitleWrapper h1{
  }
  
   .ShippingHeaderTitleWrapper h2{
 
  }
  
  .ShipperHeaderAction{
    color: ${white_color};
    text-align: center;
    width: 70%;
    padding-top: 30px;
    padding-left: 10%;
    padding-right: 10%;
    
    @media only screen and (max-width: 900px) {
       font-size: 28px;
       padding-top: 18px;
       padding-left: 7%;
       padding-right: 7%;
    }
    @media only screen and (max-width: 670px) {
       font-size: 24px;
       padding-top: 14px;
       padding-left: 3%;
       padding-right: 3%;
     }
    @media only screen and (max-width: 480px) {
       font-size: 20px;
       padding-top: 10px;
       padding-left: 1%;
       padding-right: 1%;
     }
     
  }
  
    .CarrierHeaderTitleWrapper{
  }
  
  .CarrierHeaderTitleWrapper h1{
  }
  
   .CarrierHeaderTitleWrapper h2{
  }
  
  .CarrierHeaderAction{
   
    color: ${white_color};
    text-align: center;
    width: 70%;
    padding-top: 30px;
    padding-left: 10%;
    padding-right: 10%;
    
    @media only screen and (max-width: 900px) {
       font-size: 28px;
       padding-top: 18px;
       padding-left: 7%;
       padding-right: 7%;
    }
    @media only screen and (max-width: 670px) {
       font-size: 24px;
       padding-top: 5px;
       padding-left: 3%;
       padding-right: 3%;
     }
    @media only screen and (max-width: 480px) {
       font-size: 20px;
       padding-top: 2px;
       padding-left: 1%;
       padding-right: 1%;
     }
     
  }
  
  .CarriersIntroduction{
    color: ${black_text_color};
    font-size: 1.7vw;
    font-weight: 700px
    // text-align: center;
    width: 100%;
    padding-top: 20px;
    // padding-left: ;
    // padding-right: 15%;
    
    @media only screen and (max-width: 900px) {
       font-size: 28px;
       padding-top: 18px;
    }
    @media only screen and (max-width: 600px) {
       font-size: 24px;
       padding-top: 14px;
     }
    @media only screen and (max-width: 480px) {
       font-size: 20px;
       padding-top: 10px;
     }
  
  }
 
  
  .CenteredWrapper{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .leftButtonWrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    
    @media only screen and (max-width: 767px) {
      justify-content: flex start;
    }
  }
  
  .rightButtonWrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    
    @media only screen and (max-width: 767px) {
      justify-content: flex end;
    }
  }
  
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
  
  .InnovationIcon{
     background: url(${InnovationIconImage}) no-repeat center center;
  }
  
  .MobileNavigationIcon{
     background: url(${MobileNavigationIconImage}) no-repeat center center;
  }
  
  .MarketPriceIcon{
     background: url(${MarketPriceIconImage}) no-repeat center center;
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

export default WithDirection(HomeLayoutWrapper);