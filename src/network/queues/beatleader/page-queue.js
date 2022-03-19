import {default as createQueue, PRIORITY} from '../http-queue';
import {substituteVars} from '../../../utils/format'

export const BL_HOST = 'https://api.beatleader.xyz/';
export const BL_CDN = 'https://cdn.beatleader.xyz';
export const BS_CDN = 'https://eu.cdn.beatsaver.com';
const RANKEDS_URL = BL_HOST + '/maps?ranked=true&page=${page}';

export default (options = {}) => {
  const queue = createQueue(options);

  const {fetchJson, fetchHtml, ...queueToReturn} = queue;

  const processRankeds = (data) => {
    if (!data || !Array.isArray(data)) return null;

    var result = data.map(s => {
      const {
        id,
        hash,
        name,
        subName,
        author: authorName,
        mapper: levelAuthorName,
        image: imageUrl,
      } = s;
      return s.difficulties.map(difficulty => {
        const {
          stars,
          difficultyName: diff,
          modeName: type 
        } = difficulty;
  
        const diffInfo = {diff, type};
  
        return {leaderboardId: id + "" + difficulty.value + "" + difficulty.mode, hash, name, subName, authorName, levelAuthorName, imageUrl, stars, diff, diffInfo};
      });
    }).flat();

    return result;
  }

  const rankeds = async (page = 1, priority = PRIORITY.BG_NORMAL, options = {}) => fetchJson(substituteVars(RANKEDS_URL, {page}), options, priority)
    .then(r => {
      r.body = processRankeds(r.body);

      return r;
    })

  return {
    rankeds,
    ...queueToReturn,
  }
}