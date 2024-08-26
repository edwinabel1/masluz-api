export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'DELETE') {
      return handleDeleteRequest(request, env);
    }

    return new Response('Method not allowed', { status: 405 });
  },
};

async function handleDeleteRequest(request, env) {
  try {
    const url = new URL(request.url);
    const subtitleId = url.searchParams.get('id');

    if (!subtitleId) {
      return new Response(JSON.stringify({ error: 'Subtitle ID is required' }), { status: 400 });
    }

    // 连接到 Cloudflare D1 数据库
    const db = env.MASLUZ_D1;

    try {
      // 删除字幕
      await db.prepare(`DELETE FROM subtitles WHERE id = ?`).bind(subtitleId).run();

      return new Response(JSON.stringify({ message: 'Subtitle deleted successfully!' }), { status: 200 });
    } catch (error) {
      console.error('Error deleting subtitle:', error);
      return new Response(JSON.stringify({ error: 'Failed to delete subtitle' }), { status: 500 });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
