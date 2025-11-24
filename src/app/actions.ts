'use server';

import { fetchDatabaseRecords, getApiKey } from '@/lib/notion';

export async function getRecords() {
    return await fetchDatabaseRecords();
}

export async function updateRecordStatus(pageId: string, newStatus: string) {
    const apiKey = getApiKey();

    if (!apiKey) {
        throw new Error('NOTION_API_KEY is not defined');
    }

    try {
        const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                properties: {
                    Status: {
                        select: {
                            name: newStatus
                        }
                    }
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Notion API Error:', response.status, errorText);
            throw new Error('Failed to update status');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating record status:', error);
        throw error;
    }
}

export async function updateRecordTitle(pageId: string, newTitle: string) {
    const apiKey = getApiKey();

    if (!apiKey) {
        throw new Error('NOTION_API_KEY is not defined');
    }

    try {
        const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                properties: {
                    Task: {
                        title: [
                            {
                                text: {
                                    content: newTitle
                                }
                            }
                        ]
                    }
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Notion API Error:', response.status, errorText);
            throw new Error('Failed to update title');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating record title:', error);
        throw error;
    }
}

export async function getPageContent(pageId: string): Promise<string> {
    const apiKey = getApiKey();

    if (!apiKey) {
        throw new Error('NOTION_API_KEY is not defined');
    }

    try {
        const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Notion API Error:', response.status, errorText);
            return '';
        }

        const data = await response.json();

        // Extract text content from blocks
        const textContent = data.results
            .map((block: any) => {
                if (block.type === 'paragraph' && block.paragraph?.rich_text) {
                    return block.paragraph.rich_text.map((rt: any) => rt.plain_text).join('');
                }
                if (block.type === 'heading_1' && block.heading_1?.rich_text) {
                    return block.heading_1.rich_text.map((rt: any) => rt.plain_text).join('');
                }
                if (block.type === 'heading_2' && block.heading_2?.rich_text) {
                    return block.heading_2.rich_text.map((rt: any) => rt.plain_text).join('');
                }
                if (block.type === 'heading_3' && block.heading_3?.rich_text) {
                    return block.heading_3.rich_text.map((rt: any) => rt.plain_text).join('');
                }
                if (block.type === 'bulleted_list_item' && block.bulleted_list_item?.rich_text) {
                    return '• ' + block.bulleted_list_item.rich_text.map((rt: any) => rt.plain_text).join('');
                }
                if (block.type === 'numbered_list_item' && block.numbered_list_item?.rich_text) {
                    return '- ' + block.numbered_list_item.rich_text.map((rt: any) => rt.plain_text).join('');
                }
                return '';
            })
            .filter((text: string) => text.length > 0)
            .join('\n');

        return textContent;
    } catch (error) {
        console.error('Error fetching page content:', error);
        return '';
    }
}

export async function updatePageContent(pageId: string, content: string) {
    const apiKey = getApiKey();

    if (!apiKey) {
        throw new Error('NOTION_API_KEY is not defined');
    }

    try {
        // First, get existing blocks
        const getResponse = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
            },
        });

        if (!getResponse.ok) {
            throw new Error('Failed to fetch existing blocks');
        }

        const existingData = await getResponse.json();

        // Delete existing blocks
        for (const block of existingData.results) {
            await fetch(`https://api.notion.com/v1/blocks/${block.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Notion-Version': '2022-06-28',
                },
            });
        }

        // Create new blocks from content
        const paragraphs = content.split('\n').filter(line => line.trim().length > 0);
        const blocks = paragraphs.map(text => ({
            object: 'block',
            type: 'paragraph',
            paragraph: {
                rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: text
                        }
                    }
                ]
            }
        }));

        if (blocks.length === 0) {
            return { success: true };
        }

        // Add new blocks
        const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                children: blocks
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Notion API Error:', response.status, errorText);
            throw new Error('Failed to update page content');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating page content:', error);
        throw error;
    }
}
