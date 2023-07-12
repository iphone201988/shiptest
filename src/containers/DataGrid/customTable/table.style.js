import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition } from 'settings/style-util';

const TableStyle = styled.div`

   .ant-table-body {
    overflow-x: auto;
  }
  
  .ant-table-content {
    overflow-x: auto;
  }
  
  .ant-table-thead > tr > th {
      word-break: keep-all;

      span {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        i {
          margin: ${props =>
    props['data-rtl'] === 'rtl' ? '0 0 0 10px' : '0 10px 0 0'};
          order: -1;
        }
      }
  }


  .ant-table-thead > tr > th {
    
  
    @media screen and (min-width: 1000px) {
        
    }

    @media screen and (min-width: 600px) {
        overflow-x: hidden;
    }

    @media screen and (min-width: 300px) {
    }
  
    font-weight: 700;
    color: ${palette('secondary', 2)};
    font-size: min(calc(0.7vw + 7px), 14px); //calc(max(min(1vw + 10px, 20px), 10px));
    background-color: ${palette('secondary', 1)};
    border-bottom: 0;

    &.ant-table-column-sort {
      background: ${palette('secondary', 1)};
      margin: ${props =>
    props['data-rtl'] === 'rtl' ? '0 4px 0 0' : '0 0 0 4px'};
    }
  }
  
  .ant-table-tbody > tr > td {
    
    @media screen and (min-width: 1000px) {
        
    }

    @media screen and (min-width: 600px) {
    overflow-x: hidden;
    }

    @media screen and (min-width: 300px) {
    }
    
    font-size: min(calc(0.7vw + 6px), 12px); 
    color: ${palette('text', 3)};
    border-bottom: 1px solid ${palette('border', 0)};

    a {
      color: ${palette('primary', 0)};
      ${transition()};

      &:hover {
        color: ${palette('primary', 4)};
      }
    }
  }

  .ant-tabs-content {
    margin-top: 40px;
  }

  .ant-tabs-nav {
    > div {
      color: ${palette('secondary', 2)};

      &.ant-tabs-ink-bar {
        background-color: ${palette('primary', 0)};
      }

      &.ant-tabs-tab-active {
        color: ${palette('primary', 0)};
      }
    }
  }
  .toggleOuter {
    padding: 10px 0px;
    border-bottom: 1px solid #e9e9e9;
    text-align: end;
    margin: 0px 0px 20px 0px;
}
`;

export default TableStyle;
