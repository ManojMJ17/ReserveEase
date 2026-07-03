import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './ui';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDanger = true
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-all duration-300" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl premium-shadow-lg max-w-md w-full p-6 sm:p-8 border border-slate-100/80 animate-fade-in z-10">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="space-y-4">
                    <div className={`p-3.5 rounded-2xl w-fit ${isDanger ? 'bg-rose-50 text-rose-600 border border-rose-100/50' : 'bg-violet-50 text-violet-605 border border-violet-100/50'}`}>
                        <AlertTriangle className="h-6 w-6 stroke-[1.5]" />
                    </div>

                    <div className="space-y-1.5">
                        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">{message}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 border-t border-slate-100 pt-6">
                    <Button variant="secondary" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={isDanger ? 'danger' : 'primary'}
                        onClick={() => { onConfirm(); onClose(); }}
                        className="shadow-md"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
