import styled from 'styled-components';
import { palette } from 'styled-theme';
import BoxComponent from 'components/utility/box';
import WithDirection from 'settings/withDirection';

const CardWrapper = styled.div`
  width: auto;
  overflow: inherit;
  position: relative;
  .dataViewTable {
    table {
      tbody {
        tr {
          td {
            .isoInvoiceBtnView {
              display: flex;
              flex-direction: row;
              > a {
                margin: ${props =>
    props['data-rtl'] === 'rtl' ? '0 0 0 15px' : '0 15px 0 0'};
              }
            }
          }
          &:hover {
            .isoInvoiceBtnView {
              ${'' /* opacity: 1; */};
            }
          }
        }
      }
    }
  }

  .dataViewListTable {
    .ant-dropdown-menu-item,
    .ant-dropdown-menu-submenu-title {
      &:hover {
        background-color: ${palette('secondary', 1)};
      }
    }

    .dataViewBtn {
      color: ${palette('text', 3)};

      &:hover {
        color: ${palette('primary', 0)};
      }
    }

    .dataDltBtn {
      font-size: 18px;
      border: 0;
      color: ${palette('error', 0)};

      &:hover {
        border: 0;
        color: ${palette('error', 2)};
      }
    }
  }
`;

export default WithDirection(CardWrapper);
