'use client';

import React, { useState, useRef, useEffect } from 'react';

interface StatusDropdownProps {
    currentStatus: string;
    onStatusChange: (newStatus: string) => void;
}

const AVAILABLE_STATUSES = ['시작전', '진행중', '완료', '이슈', '딜레이'];

export default function StatusDropdown({ currentStatus, onStatusChange }: StatusDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const getStatusColor = (status: string) => {
        const statusLower = status.toLowerCase();

        // Completed - Green
        if (statusLower.includes('완료') || statusLower.includes('done') || statusLower.includes('complete')) {
            return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
        }
        // In Progress - Blue
        if (statusLower.includes('진행') || statusLower.includes('progress') || statusLower.includes('doing')) {
            return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
        }
        // Issue - Red
        if (statusLower.includes('이슈') || statusLower.includes('issue') || statusLower.includes('block')) {
            return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
        }
        // Delay - Yellow/Orange
        if (statusLower.includes('딜레이') || statusLower.includes('delay') || statusLower.includes('hold')) {
            return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
        }
        // Not Started - Gray
        if (statusLower.includes('시작') || statusLower.includes('not started') || statusLower.includes('to do') || statusLower.includes('todo')) {
            return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
        }
        // Review - Purple
        if (statusLower.includes('review') || statusLower.includes('검토')) {
            return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
        }
        // Default - Gray
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleStatusClick = (status: string) => {
        if (status !== currentStatus) {
            onStatusChange(status);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(currentStatus)}`}
            >
                {currentStatus}
                <svg className="ml-1 w-3 h-3 self-center" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-32 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {AVAILABLE_STATUSES.map((status) => (
                            <button
                                key={status}
                                onClick={() => handleStatusClick(status)}
                                className={`block w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${status === currentStatus ? 'bg-gray-50 dark:bg-gray-900' : ''
                                    }`}
                            >
                                <span className={`px-2 py-1 rounded-full font-semibold ${getStatusColor(status)}`}>
                                    {status}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
