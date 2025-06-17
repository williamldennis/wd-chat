import { db } from "../src/server/db"
import OpenAI from "openai"
import { exercises } from "../src/server/db/schema";
import { eq } from "drizzle-orm";

const openai = new OpenAI();

const exercisesToEmbed = await db.query.exercises.findMany({

    where: (ex, { isNull }) => isNull(ex.embedding)
})

for (const exercise of exercisesToEmbed) {
    try {

        const prompt = `
    
You are an expert fitness coach writing structured descriptions for exercises in a workout app.

This description will be used for semantic search, so clarity and specificity are important. 
Write like you're explaining it to a motivated beginner client. 

Your response should:
- Describe the movement simply
- Explain what it trains and why it's valuable
- Mention who it benefits and which sports it supports
- Be 2 or 3 sentences long, straightforward, and helpful

---

Name: ${exercise.exerciseName}
Target Muscle Group: ${exercise?.targetMuscleGroup}
Primary Equipment: ${exercise?.primaryEquipment}
Primary Equipment Quantity: ${exercise?.primaryEquipmentQt}
Prime Mover Muscle: ${exercise?.primeMoverMuscle}
Secondary Muscle: ${exercise?.secondaryMuscle}
Posture: ${exercise?.posture}
Single or Double Arm: ${exercise?.singleOrDoubleArm}
Movement Pattern: ${exercise?.movementPattern1}
Plane of Motion: ${exercise?.planeOfMotion1}
Body Region: ${exercise?.bodyRegion}
Primary Exercise Classification: ${exercise?.primaryExerciseClassification}
Mechanics: ${exercise?.mechanics}
`

        const response = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: [
                { role: "system", content: "You are a personal trainer" },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        })

        const description = response.choices[0]?.message.content?.trim() ?? ""

        const embeddingRes = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: description,
        })

        const embedding = embeddingRes.data[0]?.embedding

        await db
            .update(exercises)
            .set({
                description,
                embedding,
            })
            .where(eq(exercises.id, exercise.id))

        console.log(`✅ Updated: ${exercise.exerciseName} (${exercise.id})`);

        await new Promise((res) => setTimeout(res, 1000));


    } catch (err) {
        console.error(`❌ Failed to process exercise ${exercise.id}:`, err);
    }
}