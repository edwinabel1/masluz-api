export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const videoId = url.searchParams.get('video_id');

    // 确保有提供 video_id 参数
    if (!videoId) {
      return new Response('video_id is required', { status: 400 });
    }

    try {
      // SQL 查询语句
      const query = `DELETE FROM lecciones WHERE video_id = ?`;

      // 连接到 Cloudflare D1 数据库
      const db = env.MASLUZ_D1;

      // 执行 SQL 语句
      await db.prepare(query).bind(videoId).run();

      return new Response(`Lesson with video_id ${videoId} deleted successfully`, { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
};
