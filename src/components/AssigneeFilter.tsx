'use client';

import React from 'react';

interface AssigneeFilterProps {
    assignees: string[];
    selectedAssignee: string | null;
    onSelectAssignee: (assignee: string | null) => void;
    counts: Record<string, number>;
}

export default function AssigneeFilter({
    assignees,
    selectedAssignee,
    onSelectAssignee,
    counts,
}: AssigneeFilterProps) {
    const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

    return (
        <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">담당자</h3>
            <div className="flex flex-wrap gap-2">
                <button
                onClick={() => onSelectAssignee(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${selectedAssignee === null
                        ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:border-white dark:hover:text-white'
                    }`}
            >
                All <span className="ml-1 opacity-60 text-xs">({totalCount})</span>
            </button>
            {assignees.map((assignee) => (
                <button
                    key={assignee}
                    onClick={() => onSelectAssignee(assignee)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${selectedAssignee === assignee
                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:border-white dark:hover:text-white'
                        }`}
                >
                    {assignee} <span className="ml-1 opacity-60 text-xs">({counts[assignee] || 0})</span>
                </button>
            ))}
            </div>
        </div>
    );
}
