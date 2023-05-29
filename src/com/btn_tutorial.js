import React, { useState } from 'react';
import { Skeleton, Popover, Button } from "antd";
import { InfoCircleOutlined } from '@ant-design/icons';

export const BtnTus = ({ 
    children,
    title= "Guide"
}) => <Popover placement="rightBottom" title={title} content={children} trigger="click">
    <InfoCircleOutlined style={{ position: 'fixed', left: 50, bottom: 15, fontSize: 25, zIndex: 1 }} />
</Popover>