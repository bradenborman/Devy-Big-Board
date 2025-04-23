import React from 'react';
import MainComponent from './mainComponent';
import { BrowserRouter } from 'react-router-dom';
import ConsentBanner from './ConsentBanner';

const AppWrapper: React.FC = () => {

    return (
        <BrowserRouter>
            <ConsentBanner />
            <div className='app-wrapper'>
                <MainComponent />
            </div>
        </BrowserRouter>
    );
};

export default AppWrapper;
