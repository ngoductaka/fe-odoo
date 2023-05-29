
import styled from 'styled-components';
import { AutoComplete, Input, Select } from 'antd';

export const InputCus = styled(Input)`
    border-radius: 5px;
`
export const SelectCus = styled(Select)`
    & .ant-select-selector{
        border-radius: 5px!important;
        width: 170px;
    } 
`
export const AutoCompleteCus = styled(AutoComplete)`
    & .ant-select-selector{
        border-radius: 5px!important;
    } 
`
export const selectS = { width: 170 }

export const Header = styled.div`
height: 50px;
width: 100%;
background: #fff;
display: flex;
justify-content: space-between;
align-items: center;
padding: 0px 10px;
span {

}
.search {
    display: flex;
align-items: center;
width: 40vw
}
`

export const Content = styled.div`
flex: 1 1 auto;
/* height: 80vh; */

.BaseTable__header-row {
  background: #fff;
  box-shadow: inset 0px -16px 11px -13px rgba(0, 0, 0, 0.18);
}

.BaseTable__header-cell-text {
  color: #000;
  font-size: 1em;
  font-weight: bold;
  user-select: none;
}

.BaseTable__row-cell {
  border-right: none;
}

.BaseTable__row {
  border-bottom: none;
  transition: 0.3s;

  &:nth-of-type(even) {
    background: #f5f5f5;
  }

  &:hover {
    background: #929191;
    .BaseTable__row-cell-text {
      color: #fff;
    }
  }
}

.BaseTable__row.active {
  background: #afafaf;
}

.BaseTable__header-cell--sortable {
  &:hover {
    background: #dedede;
  }
}

.BaseTable__sort-indicator {
  font-size: 0;
  position: relative;
  margin: 0 0 0 5px;
  &:before,
  &:after {
    background: #8c8c8c;
    content: '';
    display: block;
    height: 2px;
    position: absolute;
    top: 7px;
    width: 6px;
  }
  &:before {
    border-radius: 5px 0 0 5px;
    left: 6px;
    transform: rotate(45deg);
  }
  &:after {
    border-radius: 0 5px 5px 0;
    left: 3px;
    transform: rotate(-45deg);
  }
}

.BaseTable__sort-indicator--descending {
  &:before {
    left: 3px;
  }
  &:after {
    left: 6px;
  }
}
`;


