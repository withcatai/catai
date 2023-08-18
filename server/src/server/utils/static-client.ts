import {fileURLToPath} from 'url';
import path from 'path';
import ENV_CONFIG from '../../storage/config.js';

const __dirname = path.dirname(fileURLToPath(new URL('./', import.meta.url)));
const wwwDirectory = path.join(__dirname, '..', '..', 'www');
export function getStaticClientDirectory(){
    return path.join(wwwDirectory, ENV_CONFIG.SELECTED_UI!);
}
