import OpenAI from "openai"

export async function InitApiCall() {
    return new OpenAI({
        apiKey: process.env["OPENAI_API_KEY"]
    })
}

export async function TestApiCall(openai: OpenAI) {
    const response = await openai.chat.completions.create({
      messages: [{ role: 'user', content: 'Say this is a test' }],
      model: 'gpt-4o-mini',
    }).asResponse()

    return response
}