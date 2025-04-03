import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.API_URL) {
      throw new Error("API_URL is not defined");
    }

    const apiKey = Buffer.from(
      process.env.API_KEY_BASE64 as string,
      "base64"
    ).toString("utf-8");
     
    const response = await fetch(process.env.API_URL as string, {
      headers: {
        "x-log-key": `${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const fetchedData = await response.text();

    const parseArrayToJson = (data: string) => {
        const cleanData = data.replace(/^\["|"\]$/g, '');
        
        const itemSplitter = cleanData.split(",");
        const json = itemSplitter.map((item: string) => {
            const splitter = item.split("|=|");
            let [timestamp, event, type, message, id] = splitter;
            timestamp = timestamp.replace(/^"|"$/g, '');
            id = id.replace(/^"|"$/g, '');
            
            return { timestamp, event, type, message, id };
        });
        return json;
    }

    const data = parseArrayToJson(fetchedData);

    const sortDataByDateByNewest = (data: any) => {
        return data.sort((a: any, b: any) => {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
    }
    

    return NextResponse.json(sortDataByDateByNewest(data));
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch logs" },
      { status: 500 }
    );
  }
}