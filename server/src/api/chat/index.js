import {App} from '@tinyhttp/app';
import {requestAnswer} from './chat.js';

export const chatRouter = new App();
chatRouter.post('/question', async (req, res) => {
    const { question } = req.body;
    if (!question) {
        res.status(400).send('Missing question');
        return;
    }
    res.json(await requestAnswer(question, req));
});