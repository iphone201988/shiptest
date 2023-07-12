import styled from "styled-components";
import WithDirection from "settings/withDirection";

import ContactHeaderImage from "images/contact_us.jpeg"

import InnovationIconImage from "images/icons/innovation.png"

let dark_bleu_transparent = "rgba(0, 21, 40, 0.1)"
let dark_bleu = "rgba(0, 21, 40, 0.2)"

const ContactLayoutWrapper = styled.div`

  .InnovationIcon{
     background: url(${InnovationIconImage}) no-repeat center center;
  }
   
  .ContactPageHeaderClass{
  
    height: 400px;
    background: url(${ContactHeaderImage}) no-repeat center center;
    background-size: cover;
    position:relative;
  }
  
  .ContactPageOverHeaderClass{
    background-image: linear-gradient(to bottom, ${dark_bleu}, ${dark_bleu_transparent});
    background-color: rgba(0,0,0, 0);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  .ContactHeaderTitleWrapper{
  }
  
  .ContactHeaderTitleWrapper h1{
  }
  
  .ContactHeaderTitleWrapper h2{
  }
 
  
  
  
`
export default WithDirection(ContactLayoutWrapper);