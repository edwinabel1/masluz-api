export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 确保请求方法为 GET
    if (request.method !== 'GET') {
      return new Response('Only GET method is allowed', { status: 405 });
    }

    try {
      // SQL 查询语句
      const query = `SELECT video_id, title, teacher_name FROM lecciones`;

      // 连接到 Cloudflare D1 数据库
      const db = env.MASLUZ_D1;

      // 执行 SQL 语句
      const { results } = await db.prepare(query).all();

      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
};
