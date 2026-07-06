import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/settings', async (req, res) => {
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
      
      const responseSchema: Schema = {
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

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response from AI");
      }
      
      const data = JSON.parse(text);
      res.json(data);
    } catch (error: any) {
      console.error('Error generating settings:', error);
      res.status(500).json({ error: error.message || 'Failed to generate settings.' });
    }
  });

  app.post('/api/feedback', async (req, res) => {
    try {
      const { rating, settings, brand, model } = req.body;
      const feedbackEntry = {
        timestamp: new Date().toISOString(),
        rating,
        settings,
        brand,
        model
      };
      
      const fs = await import('fs/promises');
      const feedbackFile = path.join(process.cwd(), 'feedback.json');
      let currentFeedback = [];
      try {
        const fileData = await fs.readFile(feedbackFile, 'utf-8');
        currentFeedback = JSON.parse(fileData);
      } catch (err) {
        // Ignore if file doesn't exist
      }
      
      currentFeedback.push(feedbackEntry);
      await fs.writeFile(feedbackFile, JSON.stringify(currentFeedback, null, 2));
      
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error saving feedback:', error);
      res.status(500).json({ error: error.message || 'Failed to save feedback.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
