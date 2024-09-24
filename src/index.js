import listAudioFiles from './api/list-audio-files';
import getAudio from './api/get-audio';
import getPhoto from './api/get-photo';
import getPhotosByDate from './api/get-photos-by-date';
import uploadSubtitle from './api/upload-subtitle';
import getSubtitles from './api/get-subtitles';
import deleteSubtitle from './api/delete-subtitle';

// 引入新的 lecciones API 文件
import createLeccion from './api/lecciones/createLeccion';
import getAllLecciones from './api/lecciones/getAllLecciones';
import getLeccionById from './api/lecciones/getLeccionById';
import updateLeccion from './api/lecciones/updateLeccion';
import deleteLeccion from './api/lecciones/deleteLeccion';

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
    } else if (path === '/api/delete-subtitle') {
      response = await deleteSubtitle.fetch(request, env);
    }
    // 新的 lecciones API 处理
    else if (path === '/api/lecciones/create') {
      response = await createLeccion.fetch(request, env);
    } else if (path === '/api/lecciones') {
      response = await getAllLecciones.fetch(request, env);
    } else if (path.startsWith('/api/lecciones/get')) {
      response = await getLeccionById.fetch(request, env);
    } else if (path === '/api/lecciones/update') {
      response = await updateLeccion.fetch(request, env);
    } else if (path.startsWith('/api/lecciones/delete')) {
      response = await deleteLeccion.fetch(request, env);
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
