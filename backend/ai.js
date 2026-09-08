// AI Module - OpenAI Integration
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const extractMeetingData = async (transcript) => {
  try {
    const prompt = `You are a meeting intelligence system. Analyze this meeting transcript and extract:
1. A brief summary (2-3 sentences)
2. A list of tasks with assigned person
3. A list of key decisions

Meeting Transcript:
${transcript}

Return ONLY valid JSON in this format:
{
  "summary": "Brief summary here",
  "tasks": [
    { "task": "Task description", "assigned_to": "Person name" }
  ],
  "decisions": [
    "Decision 1",
    "Decision 2"
  ]
}`;

    const response = await axios.post(OPENAI_API_URL, {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a meeting intelligence assistant that extracts structured data from meeting transcripts.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Parse the response
    const content = response.data.choices[0].message.content;
    
    // Extract JSON from response (handle potential markdown formatting)
    let jsonStr = content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    
    const extractedData = JSON.parse(jsonStr);
    
    return {
      summary: extractedData.summary || 'No summary available',
      tasks: extractedData.tasks || [],
      decisions: extractedData.decisions || []
    };
  } catch (error) {
    console.error('AI Extraction Error:', error.message);
    throw new Error('Failed to extract meeting data: ' + error.message);
  }
};

module.exports = {
  extractMeetingData
};
