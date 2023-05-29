import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Card, Input, Button } from 'antd';

import { col } from 'page/material_list';
import Item from 'page/material_list/com/Item';
import { useSelector } from 'react-redux';
import { masterDataSelector } from 'app_state/master';

const App = () => {
    const dataSaved = useSelector(masterDataSelector);

    const dataShow = React.useMemo(() => {
        return col
            .filter((i) => i.type === 'fixed')
            .reduce((cal, cur, currentIndex) => {
                cal[currentIndex % 3] = [...(cal[currentIndex % 3] || []), cur];
                return cal;
            }, []);
    }, [col]);

    return (
        <div style={{ display: 'flex' }}>
            {dataShow.map((column, index) => (
                <div key={index + ''} style={{ padding: '0px 10px 10px 10px' }}>
                    {column.map((i) => (
                        <Item dataItem={i} key={i.optionKey} dataSaved={dataSaved[i.optionKey]} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default App;

export const Header = styled.div`
    height: 50px;
    width: 100%;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10px;
    border-bottom: 1px solid #ddd;
    .search {
        display: flex;
        align-items: center;
        width: 40vw;
    }
`;
