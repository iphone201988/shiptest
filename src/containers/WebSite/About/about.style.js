import styled from "styled-components";
import WithDirection from "settings/withDirection";
import {Colors} from "../style_constants"

import AboutHeaderImage from "images/910653_1920.jpg"

import InnovationIconImage from "images/icons/innovation.png"
import WinWinIconImage from "images/icons/handshake.png"
import GreatUserExperienceIconImage from "images/icons/thumbs-up.png"
import QualityIconImage from "images/icons/quality_monitoring.png"


let dark_bleu_transparent = "rgba(0, 21, 40, 0.3)"
let dark_bleu = "rgba(0, 21, 40, 0.8)"

const ShipperLayoutWrapper = styled.div`

  .InnovationIcon{
     background: url(${InnovationIconImage}) no-repeat center center;
  }
  .WinWinIcon{
     background: url(${WinWinIconImage}) no-repeat center center;
  }
  .GreatUserExperienceIcon{
     background: url(${GreatUserExperienceIconImage}) no-repeat center center;
  }
  .QualityIcon{
     background: url(${QualityIconImage}) no-repeat center center;
  }
   
  .AboutPageHeaderClass{
  
    height: 350px;
    background: url(${AboutHeaderImage}) no-repeat center center;
    background-size: cover;
    position:relative;
  }
  
  .AboutPageOverHeaderClass{
    background-image: linear-gradient(to bottom, ${dark_bleu}, ${dark_bleu_transparent});
    background-color: rgba(0,0,0, 0);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .AboutHeaderTitleWrapper{
     // color: ${Colors.white_color};
     // height: 100%;
     // width:90%;
     // margin-bottom: 18px;
     // margin-top: 20px;
     // padding-left: 30px;
     // padding-right: 30px;
     //
     // @media only screen and (max-width: 900px) {
     //   padding-left: 28px;
     //   padding-right: 28px;
     // }
     //
     // @media only screen and (max-width: 600px) {
     //   margin-top: 20px;
     //   padding-left: 22px;
     //   padding-right: 22px;
     // }
     //
     // @media only screen and (max-width: 480px) {
     //   margin-top: 15px;
     //   font-size: 18px;
     //   padding-left: 15px;
     //   padding-right: 15px;
     // }
  }
  
  .AboutHeaderTitleWrapper h1{
  }
  
  .AboutHeaderTitleWrapper h2{
      
  }
  
  .AboutHeaderAction{
    padding-left: 40px;

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