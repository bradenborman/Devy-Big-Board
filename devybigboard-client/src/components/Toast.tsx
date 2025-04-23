import React, { useEffect, useState } from 'react';
import './toast.scss';

interface ToastProps {
    message: string;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, duration = 5000 }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    return visible ? <div className="toast">{message}</div> : null;
};

export default Toast;