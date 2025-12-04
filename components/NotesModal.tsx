
import React, { useState } from 'react';

interface NotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    notes: string;
}

const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose, title, notes }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-jp-red px-6 py-4 flex justify-between items-center text-white sticky top-0 z-10">
                    <div className="flex-1 pr-4">
                        <h3 className="font-serif font-bold text-lg">備註</h3>
                        <p className="text-sm opacity-90 mt-0.5 truncate">{title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/20 rounded-full p-1 transition-colors shrink-0"
                        aria-label="關閉"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
                    <div className="prose prose-stone max-w-none">
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                            <div className="flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-amber-600 mt-0.5 shrink-0">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-base text-stone-700 whitespace-pre-wrap leading-relaxed">
                                        {notes.split('\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, j) => {
                                                    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                                                    if (match) {
                                                        return (
                                                            <a
                                                                key={j}
                                                                href={match[2]}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-jp-blue hover:text-jp-red underline decoration-1 underline-offset-2 font-medium transition-colors"
                                                            >
                                                                {match[1]}
                                                            </a>
                                                        );
                                                    }
                                                    return part;
                                                })}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-stone-200 px-6 py-4 bg-stone-50">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 bg-jp-ink text-white font-bold rounded-lg hover:bg-stone-800 transition-colors"
                    >
                        關閉
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotesModal;
