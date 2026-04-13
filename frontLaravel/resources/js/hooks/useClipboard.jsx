import React, { useState, useCallback } from 'react';
import { Copy } from 'lucide-react';
import Alert from '@/Components/UI/Alert';

/**
 * useClipboard hook to handle robust copying with a fallback and a standardized Alert notification.
 */
export const useClipboard = (timeout = 2000) => {
    const [isCopied, setIsCopied] = useState(false);

    const fallbackCopy = (text, callback) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            if (successful) callback();
        } catch (err) {
            console.error('Fallback de copia falló:', err);
        }
        textArea.remove();
    };

    const copy = useCallback((text) => {
        if (!text) return;

        const performFeedback = () => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), timeout);
        };

        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text)
                .then(performFeedback)
                .catch(err => {
                    console.error('Error al usar clipboard API:', err);
                    fallbackCopy(text, performFeedback);
                });
        } else {
            fallbackCopy(text, performFeedback);
        }
    }, [timeout]);

    const renderAlert = (message = "Información copiada exitosamente.") => {
        if (!isCopied) return null;

        return (
            <div className="fixed bottom-10 right-10 z-100 animate-in fade-in slide-in-from-right-10 pointer-events-none">
                <Alert 
                    variant="success"
                    title="Portapapeles"
                    message={message}
                    icon={Copy}
                    className="shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-w-[320px] pointer-events-auto"
                    onClose={() => setIsCopied(false)}
                />
            </div>
        );
    };

    return { copy, isCopied, renderAlert };
};
