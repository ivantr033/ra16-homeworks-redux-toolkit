interface ErrorAlertProps {
    message: string;
    onRetry?: () => void;
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
    return (
        <div className="error-alert" role="alert">
            <div className="error-alert-content">
                <span className="error-icon">⚠️</span>
                <p>{message}</p>
            </div>
            {onRetry && (
                <button type="button" className="btn-retry" onClick={onRetry}>
                    Повторить
                </button>
            )}
        </div>
    );
}
