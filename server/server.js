import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});

if (process.env.API_KEY == undefined) {
    console.log("ABVVV");
}

const openai = new OpenAIApi(configuration);
if (!openai) console.log("err")

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello'
    })
})

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 300,
            top_p: 1,
        });
        res.status(200).send({
            bot: response.data.choices[0].text
        });

    } catch (error) {
        console.error(error)
        res.status(500).send(error || 'Something went wrong');
    }
})


app.listen(5000, () => console.log('AI server started on http://localhost:5000'))