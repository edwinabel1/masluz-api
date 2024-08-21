export default {
  async fetch(request, env) {
    if (request.method === 'POST') {
      return handlePostRequest(request, env);
    }
    return new Response('Method not allowed', { status: 405 });
  },
};

async function handlePostRequest(request, env) {
  try {
    const formData = await request.formData();
    const subtitle = formData.get('subtitle');
    const videoId = formData.get('video_id');
    const language = formData.get('language');
    const startTime = parseFloat(formData.get('start_time'));
    const endTime = parseFloat(formData.get('end_time'));

    // 检查所需字段
    if (!subtitle || !videoId || !language || isNaN(startTime) || isNaN(endTime)) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // 连接到 Cloudflare D1 数据库
    const db = env.MASLUZ_D1;

    try {
      // 获取当前最大 sequence
      const maxSequenceResult = await db.prepare(`
        SELECT COALESCE(MAX(sequence), 0) as max_sequence 
        FROM subtitles 
        WHERE video_id = ? AND language = ?
      `).bind(videoId, language).first();

      const newSequence = maxSequenceResult.max_sequence + 1;

      // 插入新的字幕
      await db.prepare(`
        INSERT INTO subtitles (video_id, language, sequence, start_time, end_time, text)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(videoId, language, newSequence, startTime, endTime, subtitle).run();

      return new Response(JSON.stringify({ message: 'Subtitle uploaded successfully!', sequence: newSequence }), { status: 200 });
    } catch (error) {
      console.error('Error inserting subtitle:', error);
      return new Response(JSON.stringify({ error: 'Failed to upload subtitle' }), { status: 500 });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
