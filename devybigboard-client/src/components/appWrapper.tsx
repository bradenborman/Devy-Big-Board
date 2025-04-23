import React from 'react';
import MainComponent from './mainComponent';
import { BrowserRouter } from 'react-router-dom';
import ConsentBanner from './ConsentBanner';

const AppWrapper: React.FC = () => {
    // Redirect to HTTPS if using HTTP in production
    if (
        window.location.protocol === 'http:' &&
        window.location.hostname !== 'localhost'
    ) {
        window.location.href = window.location.href.replace('http:', 'https:');
        return null; // prevent rendering during redirect
    }

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