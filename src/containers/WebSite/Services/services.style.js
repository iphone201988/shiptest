import styled from "styled-components";
import WithDirection from "settings/withDirection";
import {Colors} from "../style_constants"


import ServicesHeaderImage from "images/579118_Preview.jpeg"


let dark_bleu_transparent = "rgba(0, 21, 40, 0.5)"
let dark_bleu = "rgba(0, 21, 40, 1)"

const ShipperLayoutWrapper = styled.div`
  
  
  .ServicesPageHeaderClass{
  
    background: url(${ServicesHeaderImage}) no-repeat center center;
    background-size: cover;
    position:relative;
  }
  
  .ServicesPageOverHeaderClass{
    background-image: linear-gradient(to bottom, ${dark_bleu}, ${dark_bleu_transparent});
    background-color: rgba(0,0,0, 0);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .ServicesHeaderTitleWrapper{
     color: ${Colors.white_color};
     height: 100%;
     width:90%;
     margin-bottom: 18px;
     margin-top: 20px;
     padding-left: 30px;
     padding-right: 30px;
     
     @media only screen and (max-width: 900px) {
       padding-left: 28px;
       padding-right: 28px;
     }
     
     @media only screen and (max-width: 600px) {
       margin-top: 20px;
       padding-left: 22px;
       padding-right: 22px;
     }
     
     @media only screen and (max-width: 480px) {
       margin-top: 15px;
       font-size: 18px;
       padding-left: 15px;
       padding-right: 15px;
     }
  }
  
  .ServicesHeaderTitleWrapper h1{
    color: ${Colors.white_color};
    width: 100%;
    // font-size: 3.1vw;
    font-weight: 700;
    padding-bottom: 5px;
    padding-top: 20px;
    
    @media screen and (min-width: 1000px) {
      font-size: 40px;
      padding-top: 18px;
     }
   
    @media only screen and (min-width: 200px) {
       font-size: calc(20px + 12 * ((100vw - 200px) / 800));
       padding-top: 10px;
     }
     
  }
  
  .ServicesHeaderTitleWrapper h2{
  
    color: ${Colors.white_color};
    width: 100%;
    // font-size: 2vw;
    font-weight: 700;
    padding-bottom: 5px;
    padding-top: 20px;
    line-height: 40px;
    
    @media screen and (min-width: 1000px) {
      font-size: 24px;
     }
 
    @media screen and (min-width: 200px) {
       font-size: calc(14px + 7 * ((100vw - 200px) / 800));
     }
    
    @media only screen and (max-width: 900px) {
       line-height: 26px;
       padding-top: 18px;
       line-height: 36px;
     }
     @media only screen and (max-width: 600px) {
       line-height: 30px;
       padding-top: 14px;
     }
   
    @media only screen and (max-width: 480px) {
       line-height: 22px;
       padding-top: 10px;
     }
     
     
  }
  
  .ServicesHeaderAction{
    // padding-left: 40px;
    
    color: ${Colors.white_color};
    text-align: center;
    width: 100%;
    padding-top: 20px;
    padding-left: 15%;
    padding-right: 15%;
    
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
  
  
  
`
export default WithDirection(ShipperLayoutWrapper);