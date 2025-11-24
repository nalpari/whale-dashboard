'use client';

import React, { useMemo } from 'react';
import { NotionRecord } from '@/lib/notion';

interface AssigneeStatsProps {
    assignee: string;
    records: NotionRecord[];
}

export default function AssigneeStats({ assignee, records }: AssigneeStatsProps) {
    const stats = useMemo(() => {
        const total = records.length;
        let completed = 0;
        let inProgress = 0;
        let notStarted = 0;

        records.forEach(r => {
            // Normalize status to lowercase for comparison
            const status = r.status.toLowerCase();

            // Logic:
            // Completed: "완료", "done", "complete"
            // In Progress: "진행중", "in progress", "doing"
            // Not Started: Everything else (including "시작전", "not started", "to do")
            if (status.includes('완료') || status.includes('done') || status.includes('complete')) {
                completed++;
            } else if (status.includes('진행') || status.includes('progress') || status.includes('doing')) {
                inProgress++;
            } else {
                // Includes "시작전", "not started", "to do", etc.
                notStarted++;
            }
        });

        const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        const inProgressPercentage = total > 0 ? Math.round((inProgress / total) * 100) : 0;
        const notStartedPercentage = total > 0 ? Math.round((notStarted / total) * 100) : 0;

        return {
            total,
            completed,
            inProgress,
            notStarted,
            completedPercentage,
            inProgressPercentage,
            notStartedPercentage
        };
    }, [records]);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Overview for <span className="font-bold">{assignee}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-black p-4 rounded-md shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Tasks</div>
                    <div className="text-2xl font-bold text-black dark:text-white">{stats.total}</div>
                </div>
                <div className="bg-white dark:bg-black p-4 rounded-md shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-end mb-1">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                        <div className="text-xs font-medium text-green-600 dark:text-green-400">{stats.completedPercentage}%</div>
                    </div>
                    <div className="text-2xl font-bold text-black dark:text-white mb-2">{stats.completed}</div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${stats.completedPercentage}%` }}></div>
                    </div>
                </div>
                <div className="bg-white dark:bg-black p-4 rounded-md shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-end mb-1">
                        <div className="text-sm text-gray-500 dark:text-gray-400">In Progress</div>
                        <div className="text-xs font-medium text-blue-600 dark:text-blue-400">{stats.inProgressPercentage}%</div>
                    </div>
                    <div className="text-2xl font-bold text-black dark:text-white mb-2">{stats.inProgress}</div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${stats.inProgressPercentage}%` }}></div>
                    </div>
                </div>
                <div className="bg-white dark:bg-black p-4 rounded-md shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-end mb-1">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Not Started</div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400">{stats.notStartedPercentage}%</div>
                    </div>
                    <div className="text-2xl font-bold text-black dark:text-white mb-2">{stats.notStarted}</div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                        <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: `${stats.notStartedPercentage}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
