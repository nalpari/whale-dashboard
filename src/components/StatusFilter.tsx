'use client';

import React from 'react';

interface StatusFilterProps {
    statuses: string[];
    selectedStatus: string | null;
    onSelectStatus: (status: string | null) => void;
    counts: Record<string, number>;
}

const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();

    // Completed - Green
    if (statusLower.includes('완료') || statusLower.includes('done') || statusLower.includes('complete')) {
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700';
    }
    // In Progress - Blue
    if (statusLower.includes('진행') || statusLower.includes('progress') || statusLower.includes('doing')) {
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700';
    }
    // Issue - Red
    if (statusLower.includes('이슈') || statusLower.includes('issue') || statusLower.includes('block')) {
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700';
    }
    // Delay - Yellow/Orange
    if (statusLower.includes('딜레이') || statusLower.includes('delay') || statusLower.includes('hold')) {
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700';
    }
    // Not Started - Gray
    if (statusLower.includes('시작') || statusLower.includes('not started') || statusLower.includes('to do') || statusLower.includes('todo')) {
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700';
    }
    // Review - Purple
    if (statusLower.includes('review') || statusLower.includes('검토')) {
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700';
    }
    // Default - Gray
    return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700';
};

export default function StatusFilter({
    statuses,
    selectedStatus,
    onSelectStatus,
    counts,
}: StatusFilterProps) {
    const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

    return (
        <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">상태</h3>
            <div className="flex flex-wrap gap-2">
                <button
                onClick={() => onSelectStatus(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${selectedStatus === null
                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:border-white dark:hover:text-white'
                    }`}
            >
                All Status <span className="ml-1 opacity-60 text-xs">({totalCount})</span>
            </button>
            {statuses.map((status) => {
                const statusColor = getStatusColor(status);
                const isSelected = selectedStatus === status;
                
                return (
                    <button
                        key={status}
                        onClick={() => onSelectStatus(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${isSelected
                                ? `${statusColor} border-black dark:border-white shadow-md`
                                : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:border-white dark:hover:text-white'
                            }`}
                    >
                        {status} <span className="ml-1 opacity-60 text-xs">({counts[status] || 0})</span>
                    </button>
                );
            })}
            </div>
        </div>
    );
}

