import 'zx/globals';
import {JSDOM} from 'jsdom';
import prompts from 'prompts';

let {stdout: catAIVersion} = await $`npm -g info catai version`;
catAIVersion = catAIVersion.trim();

const modelsJSONPath = path.join(__dirname, '..', '..', 'models.json');
const models = await fs.readJSON(modelsJSONPath, 'utf-8');

const fileCompressionParametersToSize = {
    'q4_0': {
        7: 3.9,
        13: 7.4,
        30: 18.3,
        65: 36.8
    },
    'q4_1': {
        7: 4.3,
        13: 8.2,
        30: 20.3,
        65: 41
    },
    'q5_0': {
        7: 4.7,
        13: 9.1,
        30: 22.4,
        65: 45
    },
    'q5_1': {
        7: 5.1,
        13: 9.8,
        30: 24.4,
        65: 49
    },
    'q8_0': {
        7: 7.2,
        13: 13.8,
        30: 34.6,
    },
    'q2_K': {
        7: 2.9,
        13: 5.6,
        30: 13.6,
        34: 14.2,
        70: 29.5
    },
    'q3_K_L': {
        7: 3.6,
        13: 7,
        30: 17.2,
        34: 17.8,
        70: 36.5
    },
    'q3_K_M': {
        7: 3.3,
        13: 6.4,
        30: 15.7,
        34: 16.3,
        70: 33.4
    },
    'q3_K_S': {
        7: 3,
        13: 5.7,
        30: 14,
        34: 14.6,
        70: 30.1
    },
    'q4_K_M': {
        7: 4.1,
        13: 7.9,
        30: 19.6,
        34: 20.2,
        70: 41.7
    },
    'q4_K_S': {
        7: 3.9,
        13: 7.4,
        30: 18.3,
        34: 19.1,
        70: 39.3
    },
    'q5_K_M': {
        7: 4.8,
        13: 9.3,
        30: 23,
        34: 23.8,
        70: 49
    },
    'q5_K_S': {
        7: 4.7,
        13: 9,
        30: 22.4,
        34: 23.2,
        70: 47.7
    },
    'q6_K': {
        7: 5.6,
        13: 10.7,
        30: 26.7,
        34: 27.7,
        70: 56.8
    }
};

async function saveModel() {
    await fs.writeFile(modelsJSONPath, JSON.stringify(models, null, 2));
}

async function getLastCommit(userName, repo) {
    const res = await fetch(`https://huggingface.co/${userName}/${repo}/tree/main`);
    const html = await res.text();
    const dom = new JSDOM(html);

    return [...dom.window.document.querySelectorAll('a')].find(x => x.href.split('commit/').pop().startsWith(x.innerHTML.trim())).href.split('/').pop();
}

function findSameModel(userName, repo, branch) {
    return Object.entries(models).find(([, value]) => {
        const sameRepo = value.download?.repo === `https://huggingface.co/${userName}/${repo}`;
        if (sameRepo && value.download.branch === branch) {
            return true;
        }
    });
}

function calculateCompatibility(file) {
    const fileCompression = file.split(".").at(-2);
    const parameters = (/-([0-9]+(\.[0-9]+)?)[bB][-.]/g).exec(file)[1];
    const fileSize = fileCompressionParametersToSize[fileCompression]?.[parameters];

    if (!fileSize) {
        throw new Error(`Can't calculate compatibility for ${file}`);
    }

    return {
        "ramGB": fileSize + .5,
        "cpuCors": Math.ceil(fileSize / 2),
        "compressions": fileCompression
    };
}


async function main() {
    let {url, userLabel} = await prompts([
        {
            type: 'text',
            name: 'url',
            message: 'Enter url',
        },
        {
            type: 'autocomplete',
            name: 'userLabel',
            message: 'Enter label',
            choices: Object.keys(models).map(x => ({title: x, value: x})),
            onState: function () {
                if (this.suggestions.length === 0) {
                    this.value = this.input;
                }
            },
        }
    ]);

    url = url.trim();
    userLabel = userLabel.trim().toLowerCase();

    const [userName, repo, , branch, file] = url.split("/").slice(-5);

    const commit = await getLastCommit(userName, repo);
    const [lable, modelInfo] = findSameModel(userName, repo, branch, file) || [];
    const {download} = modelInfo || {};

    if (lable && download.files.model === file && download.commit === commit) {
        console.log(`Model already added with label ${lable}`);
        return;
    } else if (lable === userLabel) {
        modelInfo.download.commit = commit;
        modelInfo.download.files.model = file;
        modelInfo.version += 0.1;
        modelInfo.hardwareCompatibility = calculateCompatibility(file);
        modelInfo.compatibleCatAIVersionRange = [catAIVersion];
        console.log(`Model ${lable} updated`);
        await saveModel();
        return;
    }

    models[userLabel] = {
        "download": {
            "files": {
                "model": file
            },
            "repo": `https://huggingface.co/${userName}/${repo}`,
            "commit": commit,
            "branch": branch,
        },
        "hardwareCompatibility": calculateCompatibility(file),
        "compatibleCatAIVersionRange": [catAIVersion],
        "settings": {
            "bind": "node-llama-cpp-v2"
        },
        "version": 1
    };

    await saveModel();
    console.log(`Model ${userLabel} added`);
}

main();
