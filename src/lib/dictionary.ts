export const muscleGroupToImageMap: Record<string, string> = {
    Abdominals: "/body-images/abs.png",
    Glutes: "/body-images/glutes.png",
    Chest: "/body-images/chest.png",
    Shoulders: "/body-images/shoulders.png",
    Back: "/body-images/back.png",
    Adductors: "/body-images/adductors.png",
    Biceps: "/body-images/biceps.png",
    Quadriceps: "/body-images/quads.png",
    Hamstrings: "/body-images/hamstrings.png",
    Abductors: "/body-images/abductors.png",
    Trapezius: "/body-images/traps.png",
    Triceps: "/body-images/triceps.png",
    Forearms: "/body-images/forearms.png",
    Calves: "/body-images/calves.png",
    Shins: "/body-images/shins.png",
    "Hip Flexors": "/body-images/hip-flexors.png",
};

export function getMuscleGroupImage(targetMuscleGroup: string): string {
    if (muscleGroupToImageMap[targetMuscleGroup]) {
        return muscleGroupToImageMap[targetMuscleGroup]
    } else
        return "/body-images/default.png"
}