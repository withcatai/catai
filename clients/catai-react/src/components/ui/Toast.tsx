import React, {useCallback, useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {AlertCircle, Check, X} from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
                                         message,
                                         type = 'info',
                                         duration = 3000,
                                         onClose,
                                     }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <Check className="w-5 h-5"/>,
        error: <X className="w-5 h-5"/>,
        info: <AlertCircle className="w-5 h-5"/>,
    };

    const styles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
    };

    return (
        <motion.div
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-soft-lg ${styles[type]}`}
        >
            {icons[type]}
            <span className="text-sm font-medium">{message}</span>
        </motion.div>
    );
};

interface ToastContainerProps {
    toasts: Array<ToastProps & { id: string }>;
    removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
                                                                  toasts,
                                                                  removeToast,
                                                              }) => {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

// Hook to use toasts
export function useToast() {
    const [toasts, setToasts] = useState<
        Array<ToastProps & { id: string }>
    >([]);

    const addToast = useCallback(
        (message: string, type: 'success' | 'error' | 'info' = 'info') => {
            const id = Date.now().toString();
            setToasts((prev) => [...prev, {message, type, id}]);
            return id;
        },
        []
    );

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return {toasts, addToast, removeToast};
}
