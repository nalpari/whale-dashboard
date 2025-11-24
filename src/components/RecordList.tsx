'use client';

import React, { useState } from 'react';
import { NotionRecord } from '@/lib/notion';
import { updateRecordStatus, updateRecordTitle, updatePageContent } from '@/app/actions';
import StatusDropdown from './StatusDropdown';
import TaskEditModal from './TaskEditModal';

interface RecordListProps {
    records: NotionRecord[];
    isLoading: boolean;
    onRecordUpdate?: () => void;
}

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

export default function RecordList({ records, isLoading, onRecordUpdate }: RecordListProps) {
    const [updatingRecords, setUpdatingRecords] = useState<Set<string>>(new Set());
    const [selectedRecord, setSelectedRecord] = useState<NotionRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleStatusChange = async (recordId: string, newStatus: string) => {
        setUpdatingRecords(prev => new Set(prev).add(recordId));

        try {
            await updateRecordStatus(recordId, newStatus);
            if (onRecordUpdate) {
                onRecordUpdate();
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('상태 업데이트에 실패했습니다.');
        } finally {
            setUpdatingRecords(prev => {
                const next = new Set(prev);
                next.delete(recordId);
                return next;
            });
        }
    };

    const handleTaskClick = (record: NotionRecord) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleModalSave = async (recordId: string, updates: { title?: string; status?: string; content?: string }) => {
        try {
            if (updates.title) {
                await updateRecordTitle(recordId, updates.title);
            }
            if (updates.status) {
                await updateRecordStatus(recordId, updates.status);
            }
            if (updates.content !== undefined) {
                await updatePageContent(recordId, updates.content);
            }
            if (onRecordUpdate) {
                onRecordUpdate();
            }
        } catch (error) {
            console.error('Failed to save updates:', error);
            throw error;
        }
    };
    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        );
    }

    if (records.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                No records found.
            </div>
        );
    }

    return (
        <>
            {/* Desktop View */}
            <div className="hidden sm:block overflow-hidden border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Title
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Assignee
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Last Edited
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                        {records.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div
                                        className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        onClick={() => handleTaskClick(record)}
                                    >
                                        {record.title}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {updatingRecords.has(record.id) ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 animate-pulse">
                                            Updating...
                                        </span>
                                    ) : (
                                        <StatusDropdown
                                            currentStatus={record.status}
                                            onStatusChange={(newStatus) => handleStatusChange(record.id, newStatus)}
                                        />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        {record.assigneeAvatarUrl ? (
                                            <img className="h-6 w-6 rounded-full mr-2" src={record.assigneeAvatarUrl} alt="" />
                                        ) : (
                                            <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-2 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                                                {record.assignee ? record.assignee[0] : '?'}
                                            </div>
                                        )}
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{record.assignee || 'Unassigned'}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" suppressHydrationWarning>
                                    {new Date(record.lastEditedTime).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden space-y-4">
                {records.map((record) => (
                    <div key={record.id} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <div
                                className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                onClick={() => handleTaskClick(record)}
                            >
                                {record.title}
                            </div>
                            {updatingRecords.has(record.id) ? (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2 animate-pulse">
                                    Updating...
                                </span>
                            ) : (
                                <StatusDropdown
                                    currentStatus={record.status}
                                    onStatusChange={(newStatus) => handleStatusChange(record.id, newStatus)}
                                />
                            )}
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                                {record.assigneeAvatarUrl ? (
                                    <img className="h-5 w-5 rounded-full mr-2" src={record.assigneeAvatarUrl} alt="" />
                                ) : (
                                    <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 mr-2 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                                        {record.assignee ? record.assignee[0] : '?'}
                                    </div>
                                )}
                                <span>{record.assignee || 'Unassigned'}</span>
                            </div>
                            <div suppressHydrationWarning>
                                {new Date(record.lastEditedTime).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {selectedRecord && (
                <TaskEditModal
                    record={selectedRecord}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleModalSave}
                />
            )}
        </>
    );
}
