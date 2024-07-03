import express from 'express'

import Replicate from 'replicate'

const app = express();

const replicate = new Replicate({ auth: process.env.REPLICATE_API_KEY })

app.use(express.json())

app.post('/generate', async (req, res) => {

    const { prompt } = req.body

    if (!prompt) return res.status(400).json({ errpr: "Prompt is required" })

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

app.post('/chat', async (req, res) => {

    const { prompt } = req.body

    if (!prompt) return res.status(400).json({ errpr: "Prompt is required" })

    const input = {
        top_k: 0,
        top_p: 0.95,
        prompt,
        max_tokens: 512,
        temperature: 0.7,
        system_prompt: "You are a helpful assistant",
        length_penalty: 1,
        max_new_tokens: 512,
        stop_sequences: "<|end_of_text|>,<|eot_id|>",
        prompt_template: "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
        presence_penalty: 0,
        log_performance_metrics: false
    };

    for await (const event of replicate.stream("meta/meta-llama-3-8b-instruct", { input })) {
        res.write(event.toString())
    };
    res.end()
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
})

