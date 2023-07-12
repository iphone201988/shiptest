import styled from 'styled-components';

const CardStyle = styled.div`
.ant-card-head {
  min-height: 48px;
  margin-bottom: -1px;
  padding: 0 24px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
  background: #00152812;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 2px 2px 0 0;
}
.ant-card-head-title {
  font-size: 18px;
  font-weight: 600;
}
.ant-card-body div {
  
}
.rowDots{
  position:relative !important;
}
.rowDots::before{
   position: absolute !important; 
   background: #000 !important; 
  top: 0 !important; 
  left: 0 !important; 
  content:'';
  width: 10px !important;
  height: 10px !important;
  border-radius: 50% !important;
}
.kit__l19__item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-bottom: 1.33rem;
}

.kit__l19__item:last-child {
  margin-bottom: 0;
}

.kit__l19__item:last-child .kit__l19__itemSeparator::before {
  bottom: 0;
}

.kit__l19__itemTime {
  line-height: 1;
  font-size: 10px;
  display:flex;
  font-weight: 100;
}

.kit__l19__itemSeparator {
  flex-shrink: 0;
  position: relative;
}

.kit__l19__itemSeparator::before {
  content: '';
  position: absolute;
  width:3px;
  top: 1.6rem;
  left: 0.4rem;
  bottom: -0.94rem;
  background-color: #e4e9f0;
  border-radius: 2px;
}

.kit__l19__donut {
  display: inline-block;
  width: 1.06rem;
  height: 1.06rem;
  border-radius: 100%;
  border: 4px solid #c3bedc;
  position: relative;
  top: 0.13rem;
  margin-right: 0.26rem;
}

.kit__l19__donut--md {
  width: 1.73rem;
  height: 1.73rem;
}

.kit__l19__donut--default {
  border-color: #c3bedc;
}

[data-kit-theme='dark'] .kit__l19__itemSeparator:before {
  background: #2a274d;
}

.kit__utils__donut {
  display: inline-block;
  width: 1.06rem;
  height: 1.06rem;
  border-radius: 100%;
  border: 4px solid #c3bedc;
  position: relative;
  top: 0.13rem;
  margin-right: 0.26rem;
}

.kit__utils__donut--danger {
  border-color: black;
}

.cardInnerHead {
    width:75%;
  font-weight: 700;
  color: #788195;
  font-size: min(calc(0.7vw + 7px),16px) !important;
}
.kit__l19__itemTime span {
  font-size: min(calc(0.7vw + 6px),12px);
  // margin: 0px 0px 0px 4px;
}
.kit__l19__itemTime {
  margin: 10px 0px;
}
li.kit__l19__item {
  margin: 16px 0px;
}
.ant-card ant-card-bordered{
  padding:0px !important;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12;
}
.cardInnerHead .p1{
  font-size: min(calc(0.7vw + 6px),14px);
  color: #323232;
  margin:1%;
  font-weight: 600;
  text-shadow: 1px 1px 1px rgb(0 0 0 / 0%);
  margin-bottom: 5px;
  margin-top: 5px;

}

.tripDetail .Text{
  font-size:  min(calc(0.7vw + 6px),24px);
  color: #0978E8;
  font-weight: 600;
}

.ant-card.ant-card-bordered.ant-card-hoverable {
  border: 1px solid #d9d9d9;
}
 .ant-card.ant-card-bordered.ant-card-hoverable {
  border: 1px solid #d9d9d9;
  min-height: 175px !important;
  height: 100%;
  position:relative;
}

.ant-card.ant-card-bordered.ant-card-hoverable ul.ant-card-actions {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
}
ul.list-unstyled {
  margin: 20px 0px 50px;
}
 .cardInnerHead .p1{
  margin:0px 0px 14px !important;
}
.cardInnerHead .p1:first-child span span{
  font-size:20px !important;
}

.cardInnerHead .p1 span{
  margin: 10px 0px !important;
}
.tripDetail p.Text span {
  font-size:20px !important;

}

.ant-divider-horizontal { 
  margin: 7px 0 !important;
}

button.ant-btn.ant-btn-primary {
  width: 70%;
  max-width:170px;
}
button.ant-btn {
  width: 70%;
}
.cardInnerHeadPaymentDetail {
  margin: 0px 0px 25px 0px;
}
.toggleOuter{
  padding: 10px 0px;
  border-bottom: 1px solid #e9e9e9;
  text-align: end ;
  margin: 0px 0px 20px 0px;
}
span.toolip div { background: #fff; padding: 10px; box-shadow: 0px 0px 22px 0px #00000030; }
span.toolip {
    position: absolute;
    bottom: 64px;
    right: 24px;
}

`;


export default CardStyle;
