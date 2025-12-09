// We are using native fetch because the Client's databases.query method was missing/broken
// and notion.request was failing with Invalid URL.

export const getDatabaseId = () => process.env.NOTION_DATABASE_ID || process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;
export const getApiKey = () => process.env.NOTION_API_KEY || process.env.NEXT_PUBLIC_NOTION_API_KEY;

export interface NotionRecord {
  id: string;
  title: string;
  status: string;
  assignee: string | null;
  assigneeAvatarUrl: string | null;
  lastEditedTime: string;
  url: string;
  depth1: string | null;
  depth2: string | null;
}

export const fetchDatabaseRecords = async (): Promise<NotionRecord[]> => {
  const databaseId = getDatabaseId();
  const apiKey = getApiKey();

  if (!databaseId || !apiKey) {
    console.error('NOTION_DATABASE_ID or NOTION_API_KEY is not defined');
    return [];
  }

  try {
    // Format UUID if needed (add dashes)
    let formattedDatabaseId = databaseId;
    if (databaseId.length === 32 && !databaseId.includes('-')) {
      formattedDatabaseId = `${databaseId.slice(0, 8)}-${databaseId.slice(8, 12)}-${databaseId.slice(12, 16)}-${databaseId.slice(16, 20)}-${databaseId.slice(20)}`;
    }

    const response = await fetch(`https://api.notion.com/v1/databases/${formattedDatabaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sorts: [
          {
            timestamp: 'last_edited_time',
            direction: 'descending',
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Notion API Error:', response.status, errorText);
      return [];
    }

    const data = await response.json();

    interface NotionPropertyValue {
      title?: { plain_text: string }[];
      select?: { name: string };
      status?: { name: string };
      multi_select?: { name: string; avatar_url?: string }[];
      people?: { name: string; avatar_url?: string }[];
      rich_text?: { plain_text: string }[];
    }

    interface NotionPage {
      id: string;
      last_edited_time: string;
      url: string;
      properties: Record<string, NotionPropertyValue>;
    }

    return data.results.map((page: NotionPage) => {
      const props = page.properties;

      // Map properties based on actual DB schema found in debug
      // Title is "Task"
      const title = props.Task?.title?.[0]?.plain_text ||
        props.Name?.title?.[0]?.plain_text ||
        props.Title?.title?.[0]?.plain_text ||
        'Untitled';

      // Status is "Status" (select type)
      const status = props.Status?.select?.name ||
        props.Status?.status?.name ||
        'No Status';

      // Assignee is "Assignee" (multi_select type)
      // It seems to be tags, not User objects, so no avatar_url from here directly
      const assigneeData = props.Assignee?.multi_select?.[0] ||
        props.Assignee?.people?.[0] ||
        props.Person?.people?.[0];

      const assignee = assigneeData?.name || null;
      const assigneeAvatarUrl = assigneeData?.avatar_url || null;

      // 1Depth and 2Depth columns (capital D)
      const depth1 = props['1Depth']?.select?.name ||
        props['1Depth']?.multi_select?.[0]?.name ||
        props['1Depth']?.rich_text?.[0]?.plain_text ||
        null;

      const depth2 = props['2Depth']?.select?.name ||
        props['2Depth']?.multi_select?.[0]?.name ||
        props['2Depth']?.rich_text?.[0]?.plain_text ||
        null;

      return {
        id: page.id,
        title,
        status,
        assignee,
        assigneeAvatarUrl,
        lastEditedTime: page.last_edited_time,
        url: page.url,
        depth1,
        depth2,
      };
    });
  } catch (error) {
    console.error('Error fetching Notion records:', error);
    return [];
  }
};
