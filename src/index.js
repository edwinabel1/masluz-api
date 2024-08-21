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

    if (path === '/api/list-audio-files') {
      return await listAudioFiles.fetch(request, env);
    } else if (path === '/api/get-audio') {
      return await getAudio.fetch(request, env);
    } else if (path === '/api/get-photo') {
      return await getPhoto.fetch(request, env);
    } else if (path === '/api/get-photos-by-date') {
      return await getPhotosByDate.fetch(request, env);
    } else if (path === '/api/upload-subtitle') {
		return await uploadSubtitle.fetch(request, env);
	} else if (path === '/api/get-subtitles') {
		return await getSubtitles.fetch(request, env);
	}
	else {
      return new Response('Not Found', { status: 404 });
    }
  }
};
