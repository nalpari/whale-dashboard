'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { NotionRecord } from '@/lib/notion';
import { updateRecordStatus, updateRecordTitle, updatePageContent } from '@/app/actions';
import StatusDropdown from '@/components/StatusDropdown';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface DetailPageClientProps {
    record: NotionRecord;
    initialContent: string;
}

export default function DetailPageClient({ record, initialContent }: DetailPageClientProps) {
    const [title, setTitle] = useState(record.title);
    const [status, setStatus] = useState(record.status);
    const [content, setContent] = useState(initialContent);
    const [isSaving, setIsSaving] = useState(false);

    const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        // Debounce could be added here, but for now simple onBlur or explicit save might be better. 
        // Let's stick to explicit save button for content, but maybe auto-save for title/status on blur/change?
        // For simplicity and robustness, let's use a "Save Changes" button for the content, 
        // and immediate updates for Status (as it's a dropdown). Title can be onBlur.
    };

    const handleTitleBlur = async () => {
        if (title !== record.title) {
            try {
                await updateRecordTitle(record.id, title);
            } catch (error) {
                console.error('Failed to update title', error);
                // Optionally revert or show error
            }
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        setStatus(newStatus);
        try {
            await updateRecordStatus(record.id, newStatus);
        } catch (error) {
            console.error('Failed to update status', error);
            // Revert state if needed
        }
    };

    const handleContentSave = async () => {
        setIsSaving(true);
        try {
            await updatePageContent(record.id, content);
            alert('Saved successfully!');
        } catch (error) {
            console.error('Failed to save content', error);
            alert('Failed to save content.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans">
            <header className="border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Header Section */}
                    <div className="border-b border-gray-200 dark:border-gray-800 pb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Task Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={handleTitleChange}
                                    onBlur={handleTitleBlur}
                                    className="block w-full text-3xl font-bold bg-transparent border-none p-0 focus:ring-0 placeholder-gray-300 dark:placeholder-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Task Title"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
                                    <StatusDropdown
                                        currentStatus={status}
                                        onStatusChange={handleStatusChange}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Assignee</label>
                                    <div className="flex items-center h-[38px] px-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700">
                                        {record.assigneeAvatarUrl && (
                                            <img className="h-5 w-5 rounded-full mr-2" src={record.assigneeAvatarUrl} alt="" />
                                        )}
                                        <span className="text-sm">{record.assignee || 'Unassigned'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                            {record.depth1 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                                    {record.depth1}
                                </span>
                            )}
                            {record.depth2 && (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                                    {record.depth2}
                                </span>
                            )}
                            <span className="ml-auto flex items-center gap-1">
                                Last Edited: {new Date(record.lastEditedTime).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Content</h2>
                            <button
                                onClick={handleContentSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:opacity-80 disabled:opacity-50 transition-opacity text-sm font-medium"
                            >
                                {isSaving ? 'Saving...' : 'Save Content'}
                            </button>
                        </div>
                        <div className="min-h-[500px]" data-color-mode="auto">
                            <MDEditor
                                value={content}
                                onChange={(val) => setContent(val || '')}
                                height={600}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
