export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');

    if (!date) {
      return new Response('Date parameter is required', { status: 400 });
    }

    try {
      // 列出存储桶中的所有对象
      const listResults = await env.PHOTO_BUCKET.list();

      // 筛选包含指定日期的对象，并生成文件信息
      const photos = listResults.objects
        .filter(item => item.key.includes(date))
        .map(item => ({
          key: item.key,
          url: `/api/get-photo?file=${item.key}`,  // 生成可供访问的URL
        }));

      return new Response(JSON.stringify(photos), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
};
