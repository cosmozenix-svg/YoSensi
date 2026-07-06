import { GoogleGenAI, Type, Schema } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const { brand, model, rooted, dpi } = req.body;

    if (!brand || !model || !rooted || !dpi) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const prompt = `As an expert in Free Fire game optimization, provide the best settings for the following device:
Brand: ${brand}
Model: ${model}
Rooted: ${rooted}
DPI: ${dpi}

Return the settings matching this exact JSON schema.
- Graphics: One of (Smooth, Standard, Ultra, Max)
- Fps: One of (Normal, Enhanced, High)
- Sensitivity array of exactly 6 items in this order: General, Red Dot, 2X Scope, 4X Scope, Sniper Scope, Free Look. Values should be an integer between 0 and 200.
`;
    
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        graphics: {
          type: Type.STRING,
          description: "Graphics setting: Smooth, Standard, Ultra, or Max"
        },
        fps: {
          type: Type.STRING,
          description: "FPS setting: Normal, Enhanced, or High"
        },
        sensitivity: {
          type: Type.ARRAY,
          description: "Array of 6 sensitivity integers (0-200) for General, Red Dot, 2X Scope, 4X Scope, Sniper Scope, Free Look",
          items: {
            type: Type.INTEGER
          }
        }
      },
      required: ["graphics", "fps", "sensitivity"]
    };

    const generateWithRetry = async (promptText: string, schema: any) => {
      const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
      let lastError: any = null;
      
      for (const modelName of models) {
        try {
          console.log(`Trying model ${modelName}...`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: promptText,
            config: {
              responseMimeType: "application/json",
              responseSchema: schema,
            }
          });
          return response;
        } catch (error: any) {
          console.error(`Model ${modelName} failed:`, error?.message || error);
          lastError = error;
        }
      }
      throw lastError;
    };

    const response = await generateWithRetry(prompt, responseSchema as any);

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }
    
    const data = JSON.parse(text);
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error generating settings:', error);
    res.status(500).json({ error: error.message || 'Failed to generate settings.' });
  }
}
