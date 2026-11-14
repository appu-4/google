import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));

  // API Routes
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      const { image, mimeType } = req.body;
      if (!image) {
        return res.status(400).json({ error: "No image provided" });
      }

      const prompt = `You are an expert architectural salvage and reusable construction materials AI assessor.
Inspect this material photo carefully and provide a rigorous evaluation.
Return a valid JSON object matching this exact schema:
- title: concise descriptive listing title (string)
- category: one of ["Timber & Wood", "Metals & Alloys", "Brick & Masonry", "Glass & Acrylic", "Textiles & Foam", "Hardware"]
- conditionGrade: one of ["Grade A", "Grade B", "Grade C"]
- conditionNotes: 1-sentence physical assessment (string)
- estimatedDimensions: e.g., "Approx. 15 planks, 6ft x 5in" (string)
- suggestedPrice: number in USD (number)
- estimatedRetailPrice: number in USD (number)
- co2SavedKg: estimated embodied carbon saved in kg (number)
- weightDivertedKg: estimated landfill weight diverted in kg (number)
`;

      const imagePart = {
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: image,
        },
      };

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              conditionGrade: { type: Type.STRING },
              conditionNotes: { type: Type.STRING },
              estimatedDimensions: { type: Type.STRING },
              suggestedPrice: { type: Type.NUMBER },
              estimatedRetailPrice: { type: Type.NUMBER },
              co2SavedKg: { type: Type.NUMBER },
              weightDivertedKg: { type: Type.NUMBER },
            },
            required: [
              "title",
              "category",
              "conditionGrade",
              "conditionNotes",
              "estimatedDimensions",
              "suggestedPrice",
              "estimatedRetailPrice",
              "co2SavedKg",
              "weightDivertedKg",
            ],
          },
        },
      });

      const jsonText = response.text || "{}";
      const parsed = JSON.parse(jsonText);
      res.json(parsed);
    } catch (error: any) {
      console.error("Gemini analyze error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze image with Gemini" });
    }
  });

  app.post("/api/gemini/project-match", async (req, res) => {
    try {
      const { query, inventory } = req.body;
      if (!query || !inventory) {
        return res.status(400).json({ error: "Missing query or inventory" });
      }

      const prompt = `You are an expert circular economy and upcycling design assistant.
User Project Description: "${query}"

Here is the current marketplace inventory:
${JSON.stringify(inventory, null, 2)}

Task:
1. Select the most relevant listing IDs from the inventory that can be used for this project.
2. Provide a compelling 2-sentence AI explanation banner explaining why these materials are an exceptional fit for the user's project (e.g., matching load capacity, aesthetic grain, or dimensions).
3. Return a JSON object with:
   - matchedIds: array of strings (the listing IDs)
   - aiExplanation: string
`;

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchedIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              aiExplanation: { type: Type.STRING },
            },
            required: ["matchedIds", "aiExplanation"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Gemini project-match error:", error);
      res.status(500).json({ error: error.message || "Failed to match project" });
    }
  });

  app.post("/api/gemini/copilot", async (req, res) => {
    try {
      const { material } = req.body;
      if (!material) {
        return res.status(400).json({ error: "Missing material data" });
      }

      const prompt = `You are an expert master carpenter and circular economy design consultant.
Material Details:
Title: ${material.title}
Category: ${material.category}
Condition: ${material.conditionGrade} - ${material.conditionNotes}
Dimensions: ${material.estimatedDimensions}
Price: $${material.price}

Task: Generate 3 practical, high-value DIY or construction build ideas utilizing this specific material.
Return a valid JSON object with an array 'ideas' containing exactly 3 objects:
- title: name of the build project (string)
- description: 2-sentence description of how to build it using the material (string)
- estimatedBuildTime: e.g. "4 hours", "2 days" (string)
- requiredTools: array of strings (e.g., ["Circular Saw", "Sander"])
- materialUtilizationPercent: number between 60 and 100 (number)
`;

      const response = await ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ideas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    estimatedBuildTime: { type: Type.STRING },
                    requiredTools: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    materialUtilizationPercent: { type: Type.NUMBER },
                  },
                  required: [
                    "title",
                    "description",
                    "estimatedBuildTime",
                    "requiredTools",
                    "materialUtilizationPercent",
                  ],
                },
              },
            },
            required: ["ideas"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Gemini copilot error:", error);
      res.status(500).json({ error: error.message || "Failed to generate copilot ideas" });
    }
  });

  // Vite middleware for frontend development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(vite.middlewares);

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ReClaim AI server running on http://localhost:${PORT}`);
  });
}

startServer();
