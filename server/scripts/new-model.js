import 'zx/globals';
import {JSDOM} from 'jsdom';
import prompts from 'prompts';
import {getLlama, GgufInsights, readGgufFileInfo} from 'node-llama-cpp';

let {stdout: catAIVersion} = await $`npm -g info catai version`;
catAIVersion = catAIVersion.trim();

const modelsJSONPath = path.join(__dirname, '..', '..', 'models.json');
const models = await fs.readJSON(modelsJSONPath, 'utf-8');


async function saveModel() {
    await fs.writeFile(modelsJSONPath, JSON.stringify(models, null, 2));
}

async function getLastCommit(userName, repo) {
    const res = await fetch(`https://huggingface.co/${userName}/${repo}/tree/main`);
    const html = await res.text();
    const dom = new JSDOM(html);

    return [...dom.window.document.querySelectorAll('a')].find(x => x.href.split('commit/').pop().startsWith(x.innerHTML.trim())).href.split('/').pop();
}

function findSameModel(userName, repo) {
    return Object.entries(models).find(([, value]) => {
        const sameRepo = value.download?.repo === `https://huggingface.co/${userName}/${repo}`;
        if (sameRepo) {
            return true;
        }
    });
}

async function calculateCompatibility(file) {
    const fileCompression = file.split(".").at(-2).toLowerCase();

    const modelMetadata = await readGgufFileInfo(file);
    const insights = await GgufInsights.from(modelMetadata, await getLlama());
    const {cpuRam, gpuVram} = insights.estimateModelResourceRequirements({gpuLayers: insights.totalLayers});

    const ramUsage = parseFloat(
        (
            (Math.max(cpuRam, gpuVram) / 1024 ** 3) + .5
        ).toFixed(2)
    );

    return {
        "ramGB": ramUsage,
        "cpuCors": Math.ceil(ramUsage / 2),
        "compressions": fileCompression
    };
}


async function main() {
    let {url} = await prompts({
        type: 'text',
        name: 'url',
        message: 'Enter url',
    });

    url = url.trim();

    const initialLabelValue = url.split('/').pop().toLowerCase().replace('.q', '-q').replace(/\.gguf.*/, '');
    const allKeys = new Set([...Object.keys(models), initialLabelValue]);

    let {userLabel} = await prompts(
        {
            type: 'autocomplete',
            name: 'userLabel',
            message: 'Enter label',
            initial: initialLabelValue,
            choices: [...allKeys].map(x => ({title: x})),
            onState: function () {
                if (this.suggestions.length === 0) {
                    this.value = this.input;
                }
            }
        });

    userLabel = userLabel.trim().toLowerCase();

    const [userName, repo, , branch, file] = url.split("/").slice(-5);
    const fileWithoutQuery = file.split("?")[0];

    const commit = await getLastCommit(userName, repo);
    const modelInfo = models[userLabel];
    const {download} = modelInfo || {};

    if (modelInfo && download.files.model === fileWithoutQuery && download.commit === commit) {
        console.log(`Model already added with label ${userLabel}`);
        return;
    } else if (modelInfo) {
        modelInfo.download.commit = commit;
        modelInfo.download.files.model = fileWithoutQuery;
        modelInfo.version += 0.1;
        modelInfo.hardwareCompatibility = calculateCompatibility(fileWithoutQuery);
        modelInfo.compatibleCatAIVersionRange = [catAIVersion];
        console.log(`Model ${userLabel} updated`);
        await saveModel();
        return;
    }

    models[userLabel] = {
        "download": {
            "files": {
                "model": fileWithoutQuery
            },
            "repo": `https://huggingface.co/${userName}/${repo}`,
            "commit": commit,
            "branch": branch,
        },
        "hardwareCompatibility": await calculateCompatibility(url),
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
