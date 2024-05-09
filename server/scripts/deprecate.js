let {stdout: catAIVersion} = await $`npm -g info catai version`;
catAIVersion = catAIVersion.trim();

const modelsJSONPath = path.join(__dirname, '..', '..', 'models.json');
const models = await fs.readJSON(modelsJSONPath, 'utf-8');

for (const [key, value] of Object.entries(models)) {
    if (value.compatibleCatAIVersionRange.length === 1 && value.compatibleCatAIVersionRange[0] != catAIVersion) {
        value.compatibleCatAIVersionRange.push(catAIVersion);
    }
}

await fs.writeJSON(modelsJSONPath, models);

console.log('Deprecation script finished successfully.')
