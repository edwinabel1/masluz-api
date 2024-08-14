export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const fileKey = url.searchParams.get('file');

    if (!fileKey) {
      return new Response('File key is required', { status: 400 });
    }

    try {
      // 使用 R2 的原生方法获取文件对象
      const object = await env.AUDIO_BUCKET.get(fileKey);

      if (object === null) {
        return new Response('File not found', { status: 404 });
      }

      // 设置响应头
      const headers = new Headers();
      object.writeHttpMetadata(headers); // 将文件的 HTTP 元数据（如 Content-Type）写入响应头
      headers.set('etag', object.httpEtag);

      // 确保音频文件的 Content-Type 被正确设置
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'audio/mpeg'); // 例如，对于 MP3 文件，设置为 'audio/mpeg'
      }

      // 返回文件内容
      return new Response(object.body, {
        headers,
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
};
