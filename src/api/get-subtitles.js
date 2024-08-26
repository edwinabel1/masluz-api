export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (request.method === 'GET' && pathname === '/api/get-subtitles') {
      return handleGetRequest(request, env);
    }

    return new Response('Method not allowed', { status: 405 });
  },
};

async function handleGetRequest(request, env) {
  try {
    const url = new URL(request.url);
    const videoId = url.searchParams.get('video_id');
    const language = url.searchParams.get('language');

    // 检查所需参数
    if (!videoId || !language) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 });
    }

    // 连接到 Cloudflare D1 数据库
    const db = env.MASLUZ_D1;

    try {
      // 查询该视频的全部字幕，按 sequence 排序
      const subtitles = await db.prepare(`
        SELECT sequence, start_time, end_time, text
        FROM subtitles
        WHERE video_id = ? AND language = ?
        ORDER BY start_time ASC
      `).bind(videoId, language).all();

      // 返回查询结果
      return new Response(JSON.stringify(subtitles.results), { status: 200 });
    } catch (error) {
      console.error('Error retrieving subtitles:', error);
      return new Response(JSON.stringify({ error: 'Failed to retrieve subtitles' }), { status: 500 });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
