import React, { useEffect } from 'react';
import MainComponent from './mainComponent';
import { BrowserRouter } from 'react-router-dom';
import ReactGA from 'react-ga4';
import usePageTracking from '../usePageTracking';

const AppWrapper: React.FC = () => {
    useEffect(() => {
        ReactGA.initialize('G-03DV8L1WEX');
    }, []);

    return (
        <BrowserRouter>
            <PageTracker />
            <div className='app-wrapper'>
                <MainComponent />
            </div>
        </BrowserRouter>
    );
};

const PageTracker: React.FC = () => {
    usePageTracking();
    return null;
};

export default AppWrapper;
