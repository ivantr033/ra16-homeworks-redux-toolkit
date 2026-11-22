import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearToast } from '../store/uiSlice';
import type { RootState } from '../store';

export function Toast() {
    const dispatch = useDispatch();
    const message = useSelector((state: RootState) => state.ui.toastMessage);

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => {
            dispatch(clearToast());
        }, 3000);
        return () => clearTimeout(timer);
    }, [message, dispatch]);

    if (!message) return null;

    return (
        <div className="toast-notification" role="status">
            <span>{message}</span>
        </div>
    );
}

