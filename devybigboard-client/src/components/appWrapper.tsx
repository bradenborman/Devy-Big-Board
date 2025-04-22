import React from 'react';
import MainComponent from './mainComponent';
import { BrowserRouter } from 'react-router-dom';

const AppWrapper: React.FC = () => {
    return (
        <BrowserRouter>
            <div className='app-wrapper'>
                <MainComponent />
            </div>
        </BrowserRouter>
    );
};

export default AppWrapper;