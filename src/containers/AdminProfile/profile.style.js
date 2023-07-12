import styled from 'styled-components';
import { palette } from 'styled-theme';
import bgImage from 'images/work.jpg';
import WithDirection from 'settings/withDirection';

const ProfileStyleWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  background: url(${bgImage}) no-repeat center center;
  background-size: cover;

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    display: flex;
    background-color: rgba(0, 0, 0, 0.6);
    position: absolute;
    z-index: 1;
    top: 0;
    left: ${props => (props['data-rtl'] === 'rtl' ? 'inherit' : '0')};
    right: ${props => (props['data-rtl'] === 'rtl' ? '0' : 'inherit')};
  }
  
  .column {
        float: left;
        width: 50%;
        padding: 10px;
      }

  .row:after {
      content: "";
      display: table;
      clear: both;
  }

  .isoSignUpContentWrapper {
    width: 70%;
    height: 100%;
    overflow-y: auto;
    z-index: 10;
    position: relative;
  }

  .isoSignUpContent {
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

    .isoLogoWrapper {
      width: 100%;
      display: flex;
      margin-bottom: 50px;
      justify-content: center;
      flex-shrink: 0;

      a {
        font-size: 24px;
        font-weight: 300;
        line-height: 1;
        text-transform: uppercase;
        color: ${palette('secondary', 2)};
      }
    }

    .isoProfileForm {
      width: 100%;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;

      .isoInputWrapper {
        margin-bottom: 200px;

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

    }
  }
`;

export default WithDirection(ProfileStyleWrapper);
