export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 确保请求方法为 POST
    if (request.method !== 'POST') {
      return new Response('Only POST method is allowed', { status: 405 });
    }

    // 解析请求体
    let requestData;
    try {
      requestData = await request.json();
    } catch (error) {
      return new Response('Invalid JSON body', { status: 400 });
    }

    // 检查必须的字段 'video_id' 和 'title'
    const requiredFields = ['video_id', 'title'];
    for (const field of requiredFields) {
      if (!requestData[field]) {
        return new Response(`${field} is required`, { status: 400 });
      }
    }

    try {
      // SQL 查询语句
      const query = `
        INSERT INTO lecciones (video_id, title, teacher_name, description, keywords, sections, subtitles_status, notes_link, tags, comprehension_level)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

      const values = [
        requestData.video_id,  // 使用手动提供的 video_id
        requestData.title,     // 使用手动提供的 title
        requestData.teacher_name || null,
        requestData.description || null,
        requestData.keywords || null,
        requestData.sections || null,
        requestData.subtitles_status || 0,
        requestData.notes_link || null,
        requestData.tags || null,
        requestData.comprehension_level || 0
      ];

      // 连接到 Cloudflare D1 数据库
      const db = env.MASLUZ_D1;

      // 执行 SQL 语句
      await db
        .prepare(query)
        .bind(...values)
        .run();

      return new Response(`Lesson created successfully with video_id: ${requestData.video_id}`, { status: 201 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
};
