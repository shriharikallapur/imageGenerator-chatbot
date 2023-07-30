import { Configuration, OpenAIApi } from 'openai';
import Express from 'express';
import Cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
config()

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.API_URL
}))

const app = Express();
app.use(bodyParser.json());
app.use(Cors());

app.post("/imageGenerator", async (req, res) => {
  const { prompt } = req.body;

  const response = await openai.createImage({
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });
  res.send(response.data.data[0].url);
});

app.listen(process.env.PORT, () => {
  console.log(`server is listening on this port ${process.env.PORT}`);
})