import styled from 'styled-components';
import { palette } from 'styled-theme';
import { borderRadius, transition } from 'settings/style-util';
import WithDirection from 'settings/withDirection';

let bleu_grey = "#1e4f80"
let white_color = "#ffffff"

const CollapseStyleWrapper = styled.div`
  .ant-collapse {
    background-color: transparent;
    border-radius: 0;
    border: 0;

    > .ant-collapse-item {
      background-color: ${bleu_grey};
      border-radius: 4px;
      border: 1px solid ${palette('border', 0)};
      margin-bottom: 5px;

      &:last-child {
        margin-bottom: 0;
      }

      > .ant-collapse-header {
        height: 50px;
        line-height: 22px;
        // padding-left: ${props => (props['data-rtl'] === 'rtl' ? '32px' : '16px')};
        // padding-right: ${props => (props['data-rtl'] === 'rtl' ? '16px' : '32px')};
        font-size: 1.5vw;
        color: #fff;
        font-weight: 700;
        @media only screen and (max-width: 670px) {
           font-size: 3vw;
        }
        // color: ${palette('text', 0)};
        cursor: pointer;
        position: relative;
        background-color: ${bleu_grey};
        // background-color: ${palette('grayscale', 6)};
        
        ${transition(0.4)};
        ${borderRadius('4px 4px 0 0')};

        .arrow {
          font-size: 16px;
          transform: ${props =>
            props['data-rtl'] === 'rtl'
              ? 'scale(0.75) rotate(180deg)'
              : 'scale(0.75) rotate(0)'};
          right: ${props => (props['data-rtl'] === 'rtl' ? 'auto' : '16px')};
          left: ${props => (props['data-rtl'] === 'rtl' ? '16px' : 'auto')};
        }

        &[aria-expanded='true'] {
          .arrow {
            font-size: 16px;
          }
        }
      }

      .ant-collapse-content {
        border-top: 1px solid ${palette('border', 0)};
        ${borderRadius('0 0 4px 4px')};

        p {
          font-size: 1.5vw;
          // color: ${palette('text', 3)};
          color: black;
          @media only screen and (max-width: 670px) {
            font-size: 3vw;
            font-size: 15px;
          }
          
          @media only screen and (max-width: 480px) {
            font-size: 3vw;
            font-size: 13px;
          }
          
        }
      }

      &.ant-collapse-item-active {
        > .ant-collapse-header {
          .arrow {
            transform: ${props =>
              props['data-rtl'] === 'rtl'
                ? 'scale(0.75) rotate(90deg)'
                : 'scale(0.75) rotate(90deg)'};
          }
        }
      }
    }

    &.ant-collapse-borderless {
      > .ant-collapse-item {
        border-radius: 0;
        border: 0;

        > .ant-collapse-header {
          background-color: ${palette('secondary', 1)};
          ${borderRadius()};
        }

        .ant-collapse-content {
          border-top: 0;
          ${borderRadius()};
        }
      }
    }
  }
`;

export default WithDirection(CollapseStyleWrapper);
