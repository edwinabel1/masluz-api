export default {
  async fetch(request, env) {
    try {
      // 列出存储桶中的对象
      const listResults = await env.AUDIO_BUCKET.list();

      // 生成文件列表，返回对象的基本元数据
      const files = listResults.objects
        .filter(item => item.key.endsWith('.mp3')) // 仅保留 .mp3 文件
        .map(item => {
          const key = item.key;

          // 我们不再手动拼接 URL，而是返回对象的相关信息
          return {
            key
          };
        });

      // 返回文件列表
      return new Response(JSON.stringify(files), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
};
