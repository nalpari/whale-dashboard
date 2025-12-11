import { getRecord, getPageContent, updateRecordStatus, updateRecordTitle, updatePageContent } from '@/app/actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DetailPageClient from './DetailPageClient';

// Server component to fetch data
export default async function RecordDetailPage({ params }: { params: { id: string } }) {
    // Await params object
    const { id } = await params;

    // Parallel data fetching
    const [record, content] = await Promise.all([
        getRecord(id),
        getPageContent(id)
    ]);

    if (!record) {
        notFound();
    }

    return (
        <DetailPageClient
            record={record}
            initialContent={content}
        />
    );
}
