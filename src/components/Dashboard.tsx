'use client';

import { useState, useEffect, useMemo } from 'react';
import { NotionRecord } from '@/lib/notion';
import { getRecords } from '@/app/actions';
import RecordList from './RecordList';
import AssigneeFilter from './AssigneeFilter';
import AssigneeStats from './AssigneeStats';
import ThemeToggle from './ThemeToggle';

export default function Dashboard() {
    const [records, setRecords] = useState<NotionRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const data = await getRecords();
            setRecords(data);
        } catch (error) {
            console.error('Failed to fetch records', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const assignees = useMemo(() => {
        const uniqueAssignees = new Set<string>();
        records.forEach((r) => {
            if (r.assignee) uniqueAssignees.add(r.assignee);
        });
        return Array.from(uniqueAssignees).sort();
    }, [records]);

    const counts = useMemo(() => {
        const c: Record<string, number> = {};
        records.forEach((r) => {
            if (r.assignee) {
                c[r.assignee] = (c[r.assignee] || 0) + 1;
            }
        });
        return c;
    }, [records]);

    const filteredRecords = useMemo(() => {
        if (!selectedAssignee) return records;
        return records.filter((r) => r.assignee === selectedAssignee);
    }, [records, selectedAssignee]);


    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans transition-colors duration-300">
            <header className="border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                            <span className="text-white dark:text-black font-bold text-lg">W</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Whale Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={fetchData}
                            disabled={isLoading}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 text-gray-600 dark:text-gray-300"
                            title="Refresh Data"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Tasks Overview</h2>
                    <p className="text-gray-500 dark:text-gray-400">Manage and track your team&apos;s progress.</p>
                </div>

                <AssigneeFilter
                    assignees={assignees}
                    selectedAssignee={selectedAssignee}
                    onSelectAssignee={setSelectedAssignee}
                    counts={counts}
                />

                <AssigneeStats
                    assignee={selectedAssignee || "All Tasks"}
                    records={filteredRecords}
                />

                <RecordList records={filteredRecords} isLoading={isLoading} onRecordUpdate={fetchData} />
            </main>
        </div>
    );
}
