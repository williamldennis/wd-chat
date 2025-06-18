import { useState } from "react";
import type { Exercise } from "@/types/exercise";

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