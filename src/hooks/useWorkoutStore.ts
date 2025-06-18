import { useState } from "react";

export type Exercise = {
    id: string;
    name: string | null;
    youtubeShort: string | null;
    muscleGroup: string;
    description: string | null;
}

export function useWorkoutStore() {
    const [exercises, setExercises] = useState<Exercise[]>([])

    function addExercise(newExercise: Exercise | Exercise[]) {
        setExercises((prev) => [
            ...prev,
            ...(Array.isArray(newExercise) ? newExercise : [newExercise]),
        ])
    }
    function resetExercises() {
        setExercises([])

    }

    return { exercises, addExercise, resetExercises }
}