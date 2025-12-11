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
            const status = r.status.toLowerCase();
            if (status.includes('완료') || status.includes('done') || status.includes('complete')) {
                completed++;
            } else if (status.includes('진행') || status.includes('progress') || status.includes('doing')) {
                inProgress++;
            } else {
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
        <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                Overview for <span className="text-blue-600 dark:text-blue-400">{assignee}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Total Tasks */}
                <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-40 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Tasks</div>
                        <div className="mt-2 text-5xl font-extrabold text-gray-900 dark:text-white">{stats.total}</div>
                    </div>
                </div>

                {/* Completed */}
                <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-40 relative overflow-hidden group hover:border-green-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex justify-between items-start">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Completed</div>
                            <div className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md">
                                {stats.completedPercentage}%
                            </div>
                        </div>
                        <div className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">{stats.completed}</div>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mt-4 overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${stats.completedPercentage}%` }}></div>
                    </div>
                </div>

                {/* In Progress */}
                <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-40 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex justify-between items-start">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">In Progress</div>
                            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                                {stats.inProgressPercentage}%
                            </div>
                        </div>
                        <div className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</div>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mt-4 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${stats.inProgressPercentage}%` }}></div>
                    </div>
                </div>

                {/* Not Started */}
                <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between h-40 relative overflow-hidden group hover:border-gray-500/50 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex justify-between items-start">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Not Started</div>
                            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                                {stats.notStartedPercentage}%
                            </div>
                        </div>
                        <div className="mt-2 text-4xl font-bold text-gray-900 dark:text-white">{stats.notStarted}</div>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mt-4 overflow-hidden">
                        <div className="bg-gray-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${stats.notStartedPercentage}%` }}></div>
                    </div>
                </div>

            </div>
        </div>
    );
}
