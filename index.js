import express from 'express'

import Replicate from 'replicate'

const app = express();

app.use(express.json())

app.post('/generate', async (req, res) => {

    const { prompt } = req.body

    if (!prompt) return res.status(400).json({ errpr: "Prompt is required" })

    const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY })

    const input = {
        cfg: 3.5,
        steps: 28,
        prompt,
        aspect_ratio: "3:2",
        output_format: "webp",
        output_quality: 90,
        negative_prompt: "",
        prompt_strength: 0.85
    };

    const output = await replicate.run("stability-ai/stable-diffusion-3", { input });

    console.log(output);

    res.json(output)

    res.send('Generando')
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
})

