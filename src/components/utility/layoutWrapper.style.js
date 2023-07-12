import styled from "styled-components";

const LayoutContentWrapper = styled.div`
  padding: 10px;
  display: flex;
  flex-flow: row wrap;
  overflow: hidden;
  height: 100%;
  width: 100%;
  background: white;
  margin-top: 10px;

  @media only screen and (max-width: 767px) {
    padding: 5px 5px;
  }

  @media (max-width: 580px) {
    padding: 5px;
  }
  .toggleOuter{
    padding: 10px 0px;
    text-align: end ;
    display: flex;
    margin:auto !important;
    margin-right:0 !important;
    justify-content: end !important;
  }
  .filterBox{
    display: flex !important;
    align-items: center !important;
  }


`;

export { LayoutContentWrapper };
