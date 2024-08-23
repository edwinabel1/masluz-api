import listAudioFiles from './api/list-audio-files';
import getAudio from './api/get-audio';
import getPhoto from './api/get-photo';
import getPhotosByDate from './api/get-photos-by-date';
import uploadSubtitle from './api/upload-subtitle';
import getSubtitles from './api/get-subtitles';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    let response;

    if (request.method === 'OPTIONS') {
      // 处理预检请求
      response = handleOptions(request);
    } else if (path === '/api/list-audio-files') {
      response = await listAudioFiles.fetch(request, env);
    } else if (path === '/api/get-audio') {
      response = await getAudio.fetch(request, env);
    } else if (path === '/api/get-photo') {
      response = await getPhoto.fetch(request, env);
    } else if (path === '/api/get-photos-by-date') {
      response = await getPhotosByDate.fetch(request, env);
    } else if (path === '/api/upload-subtitle') {
      response = await uploadSubtitle.fetch(request, env);
    } else if (path === '/api/get-subtitles') {
      response = await getSubtitles.fetch(request, env);
    } else {
      response = new Response('Not Found', { status: 404 });
    }

    // 添加 CORS 头部
    return new Response(response.body, {
      ...response,
      headers: {
        ...response.headers,
        'Access-Control-Allow-Origin': '*', // 允许所有来源
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
};

// 处理 OPTIONS 请求
function handleOptions(request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400', // 预检请求的缓存时间
    },
  });
}
