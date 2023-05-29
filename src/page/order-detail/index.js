
import { GeneralHeader } from 'com/app_layout/general_header';
import React from 'react';
import GenerateFrom from './generate_data/input_material/input';

const App = () => {
    return (
        <div>
            <GeneralHeader title='Order Detail' />
            <GenerateFrom />
        </div>
    )
}

export default App;