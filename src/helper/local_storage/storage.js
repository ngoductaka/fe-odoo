
export const setItem = (key, val) => {
    if (typeof val === 'object') {
        localStorage.setItem(key, JSON.stringify(val))
    } else {
        localStorage.setItem(key, val)
    }
}
export const getItem = key => {
    try {
        const data = localStorage.getItem(key)
        return JSON.parse(data);
    } catch (err) {
        return localStorage.getItem(key);
    }
}

export const getById = (key, val, byField = 'id') => {
    const data = getItem(key);
    return data.find(item => item[byField] === val)
}

export const insertArr = (key, newData) => {
    const oldData = getItem(key) || [];
    setItem(key, [
        ...oldData, ...newData,
    ])
}
export const upsertOne = (key, newData) => {
    const oldData = getItem(key) || [];
    const index = oldData.findIndex(i => i.id === newData.id);
    console.log('index', index, oldData, newData)
    if (index === -1) { // 404
        setItem(key, [
            ...oldData,
            newData,
        ])
    } else {
        oldData[index] = newData;
        setItem(key, oldData)
    }
}
export const delOne = (key, newData) => {
    const oldData = getItem(key) || [];
    const newDataSave = oldData.filter(i => i.id !== newData.id);
    setItem(key, newDataSave)
}
export const insertObj = (key, newData) => {
    const oldData = getItem(key) || {};
    const dataSave = {
        ...oldData, ...newData,
    };
    console.log('dataSave', dataSave);
    setItem(key, dataSave)
}

