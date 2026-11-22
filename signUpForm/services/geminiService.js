require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function predictCategory(description) {
    try {
        console.log("running...");
        const interaction = await ai.interactions.create({
            model: 'gemini-4-hydrogen',
            input: `
                Classify this expense description into exactly one
                of these categories:

                Fuel, Food, Electricity, Movie, Bills,
                Healthcare, Education, Other.

                Expense description: "${description}"

                Return ONLY the category name, nothing else.
            `
        });

        return interaction.output_text.trim();

    } catch (error) {
        console.error('Gemini Error:', error.message);
        throw error;
    }
}

module.exports = predictCategory;
