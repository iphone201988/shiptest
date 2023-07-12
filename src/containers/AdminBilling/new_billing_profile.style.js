import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from 'settings/withDirection';

const BillingProfileWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-size: cover;

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    z-index: 1;
    top: 0;
    left: ${props => (props['data-rtl'] === 'rtl' ? 'inherit' : '0')};
    right: ${props => (props['data-rtl'] === 'rtl' ? '0' : 'inherit')};
  }

  .isoUserContentWrapper {
    width: 70%;
    height: 100%;
    overflow-y: auto;
    z-index: 10;
    position: relative;
  }

  .isoUserContent {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    padding: 70px 50px;
    position: relative;
    background-color: #ffffff;

    @media only screen and (max-width: 767px) {
      width: 100%;
      padding: 70px 20px;
    }

   
    .isoUserForm {
      width: 100%;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;

      .isoInputWrapper {
        margin-bottom: 15px;

        &:last-child {
          margin-bottom: 0;
        }

        input {
          &::-webkit-input-placeholder {
            color: ${palette('grayscale', 0)};
          }

          &:-moz-placeholder {
            color: ${palette('grayscale', 0)};
          }

          &::-moz-placeholder {
            color: ${palette('grayscale', 0)};
          }
          &:-ms-input-placeholder {
            color: ${palette('grayscale', 0)};
          }
        }
      }
      
      .submitButton{
        padding-top: 30px;
      }

      .isoLeftRightComponent {
        input {
          width: calc(100% - 10px);

          &:first-child {
            margin-right: ${props =>
    props['data-rtl'] === 'rtl' ? 'inherit' : '20px'};
            margin-left: ${props =>
    props['data-rtl'] === 'rtl' ? '20px' : 'inherit'};
          }
        }
      }

      .isoHelperWrapper {
        margin-top: 35px;
        flex-direction: column;
      }
      
      .isoInputTitle {
        font-size: 12px;
        color: black;
        font-weight: 700;
      }

      button {
        font-weight: 500;
        width: 100%;
        height: 42px;
        border: 0;       
      }
    }
  }
`;

export default WithDirection(BillingProfileWrapper);
