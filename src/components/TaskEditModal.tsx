import React, { useState, useEffect } from 'react';
import { NotionRecord } from '@/lib/notion';
import { getPageContent } from '@/app/actions';
import StatusDropdown from './StatusDropdown';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(
    () => import('@uiw/react-md-editor'),
    { ssr: false }
);

interface TaskEditModalProps {
    record: NotionRecord;
    isOpen: boolean;
    onClose: () => void;
    onSave: (recordId: string, updates: { title?: string; status?: string; content?: string }) => Promise<void>;
}

export default function TaskEditModal({ record, isOpen, onClose, onSave }: TaskEditModalProps) {
    const [title, setTitle] = useState(record.title);
    const [status, setStatus] = useState(record.status);
    const [content, setContent] = useState('');
    const [isLoadingContent, setIsLoadingContent] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setTitle(record.title);
        setStatus(record.status);

        // Load page content when modal opens
        if (isOpen) {
            setIsLoadingContent(true);
            getPageContent(record.id)
                .then(pageContent => {
                    setContent(pageContent);
                })
                .catch(error => {
                    console.error('Failed to load content:', error);
                    setContent('');
                })
                .finally(() => {
                    setIsLoadingContent(false);
                });
        }
    }, [record, isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updates: { title?: string; status?: string; content?: string } = {};
            if (title !== record.title) updates.title = title;
            if (status !== record.status) updates.status = status;
            if (content.trim()) updates.content = content;

            if (Object.keys(updates).length > 0) {
                await onSave(record.id, updates);
            }
            onClose();
        } catch (error) {
            console.error('Failed to save:', error);
            alert('저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">작업 편집</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Title Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            제목
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="작업 제목을 입력하세요"
                        />
                    </div>

                    {/* Status Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            상태
                        </label>
                        <div className="flex items-center gap-2">
                            <StatusDropdown
                                currentStatus={status}
                                onStatusChange={setStatus}
                            />
                        </div>
                    </div>

                    {/* Assignee (Read-only for now) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            담당자
                        </label>
                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300">
                            {record.assignee || '미지정'}
                        </div>
                    </div>

                    {/* Content Field with Markdown Editor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            내용 (Markdown 에디터)
                        </label>
                        {isLoadingContent ? (
                            <div className="w-full px-4 py-12 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>내용 불러오는 중...</span>
                                </div>
                            </div>
                        ) : (
                            <div data-color-mode="auto">
                                <MDEditor
                                    value={content}
                                    onChange={(val) => setContent(val || '')}
                                    height={400}
                                    preview="live"
                                    hideToolbar={false}
                                    enableScroll={true}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                저장 중...
                            </>
                        ) : (
                            '저장'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
