import React from 'react';
function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

export const UseGetSize = () => {
    const { width, height } = React.useMemo(() => {
        return getWindowDimensions()
    }, [])
    return { width, height }
}
