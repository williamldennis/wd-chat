type ExerciseProps = {
    name: number;
    youtube_short: string;
    muscle_group: string;
};

export const Exercise = ({ name, youtube_short, muscle_group }: ExerciseProps) => {
    return (
        <div className="my-4 rounded-xl border-1 border-blue-300 bg-amber-50 p-4">
            <h2 className="mb-1 font-bold">Exercise: {name}</h2>
            <div className="flex gap-4">
            </div>
            <div>
                <iframe
                    className="w-full h-full"
                    src={youtube_short}
                    title=""
                >
                </iframe>
            </div>
        </div>
    );
};
