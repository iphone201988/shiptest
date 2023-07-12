import styled from "styled-components";
import WithDirection from "settings/withDirection";
import {Colors} from "../style_constants"

import SectionHeaderImage from "images/contact_us.jpeg"

import InnovationIconImage from "images/icons/innovation.png"

let dark_bleu_transparent = "rgba(0,21,40,0.1)"
let dark_bleu = "rgba(0, 21, 40, 0.2)"

const SectionLayoutWrapper = styled.div`


  .SectionLayoutHeaderClass{
  
    height: 400px;
    background: url(${SectionHeaderImage}) no-repeat center center;
    background-size: cover;
    position:relative;
  }
  
  .SectionLayoutOverHeaderClass{
    background-image: linear-gradient(to bottom, ${dark_bleu}, ${dark_bleu_transparent});
    background-color: rgba(0,0,0, 0);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .SectionHeaderTitleWrapper{
     display: flex;
     align-items: center;
     color: ${Colors.black_text_color};
     height: 100%;
     width:100%;
  }
  
  .SectionHeaderTitleWrapper h1{
    color: ${Colors.black_text_color};
    width: 100%;
    text-align: center;
    font-weight: 700;
    
    @media screen and (min-width: 1000px) {
      font-size: 40px;
     }
   
    @media only screen and (min-width: 200px) {
       font-size: calc(20px + 12 * ((100vw - 200px) / 800));
     }
  }
  
  .SectionHeaderTitleWrapper h2{
    color: ${Colors.black_text_color};
    width: 100%;
    text-align: center;
    font-weight: 700;
    
    @media screen and (min-width: 1000px) {
      font-size: 30px;
     }
   
    @media only screen and (min-width: 200px) {
       font-size: calc(18px + 10 * ((100vw - 200px) / 800));
     }
  }
 
  
  
  
`
export default WithDirection(SectionLayoutWrapper);