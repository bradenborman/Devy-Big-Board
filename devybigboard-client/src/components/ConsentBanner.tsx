import React, { useEffect, useState } from 'react';
import './consentBanner.scss';

const ConsentBanner: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) setVisible(true);
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookie_consent', 'granted');
        setVisible(false);
    };

    const declineCookies = () => {
        localStorage.setItem('cookie_consent', 'denied');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="consent-banner">
            <p>This site uses cookies to enhance the user experience.</p>
            <div className="buttons">
                <button onClick={acceptCookies}>Accept</button>
                <button onClick={declineCookies}>Decline</button>
            </div>
        </div>
    );
};

export default ConsentBanner;
