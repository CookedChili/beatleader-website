import * as Comlink from 'comlink'
import log from '../utils/logger'

export let worker = null;

export default async () => {
  log.info('Initializing workers...', 'Workers')

  worker = Comlink.wrap(new Worker('/build/stats-worker.js?20210804'));
  await worker.init();

  log.info('Workers initialized.', 'Workers')
}