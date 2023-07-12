import styled from 'styled-components';
import { palette } from 'styled-theme';
import BoxComponent from 'components/utility/box';

const Box = styled(BoxComponent)`
  .AddressInputSuccess {
    &.ant-select {
        .ant-select-selection {
          &.ant-select-selection--single {
              .ant-input {
                border-color: green;    
                // &:focus {
                //   border-color: ${palette('primary', 0)};
                //   outline: 0;
                //   box-shadow: 0 0 0 2px ${palette('primary', 3)};
                // }
                //
                // &:hover {
                //   border-color: ${palette('primary', 0)};
                // }
              }
            }
          }
        }
  }
  .AddressInputFail {
      &.ant-select {
        .ant-select-selection {
          &.ant-select-selection--single {
              .ant-input {
                border-color: red;
    
                &:focus {
                  border-color: ${palette('primary', 0)};
                  outline: 0;
                  box-shadow: 0 0 0 2px ${palette('primary', 3)};
                }
    
                &:hover {
                  border-color: ${palette('primary', 0)};
                }
              }
            }
          }
        }
  }
`;

export {Box}