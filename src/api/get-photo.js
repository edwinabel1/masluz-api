export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const fileKey = url.searchParams.get('file');

    if (!fileKey) {
      return new Response('File key is required', { status: 400 });
    }

    try {
      // 使用 R2 的原生方法获取照片对象
      const object = await env.PHOTO_BUCKET.get(fileKey);

      if (object === null) {
        return new Response('File not found', { status: 404 });
      }

      // 设置响应头
      const headers = new Headers();
      object.writeHttpMetadata(headers); // 将文件的 HTTP 元数据写入响应头
      headers.set('etag', object.httpEtag);

      // 确保图片文件的 Content-Type 被正确设置
      if (!headers.has('Content-Type')) {
        const extension = fileKey.split('.').pop().toLowerCase();
        if (extension === 'jpg' || extension === 'jpeg') {
          headers.set('Content-Type', 'image/jpeg');
        } else if (extension === 'png') {
          headers.set('Content-Type', 'image/png');
        } else {
          headers.set('Content-Type', 'application/octet-stream'); // 默认类型
        }
      }

      // 返回照片文件内容
      return new Response(object.body, {
        headers,
        status: 200,
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
};
