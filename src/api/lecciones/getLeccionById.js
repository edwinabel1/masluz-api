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
      const query = `SELECT * FROM lecciones WHERE video_id = ?`;

      // 连接到 Cloudflare D1 数据库
      const db = env.MASLUZ_D1;

      // 执行 SQL 语句，获取单行数据
      const result = await db.prepare(query).bind(videoId).first();

      // 检查是否有数据返回
      if (!result) {
        return new Response('Lesson not found', { status: 404 });
      }

      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
};
