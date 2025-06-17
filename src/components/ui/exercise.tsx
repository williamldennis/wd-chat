type ExerciseProps = {
    id: string;
    name: string | null;
    youtubeShort: string | null;
    muscleGroup: string | null;
};

import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Exercise({ name, youtubeShort, muscleGroup, id }: ExerciseProps) {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <iframe
                    className="w-full h-full pb-4 rounded-md"
                    src={youtubeShort ? youtubeShort : undefined}
                    title=""
                >
                </iframe>
                <CardDescription>
                    This is how you do the exercise. A nice description and some tips.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="">Reps & Weight</Label>
                            <div className="flex gap-2">
                                <Input
                                    id=""
                                    type=""
                                    placeholder="Reps"
                                    required
                                />
                                <Input
                                    id=""
                                    type=""
                                    placeholder="Weight"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    id=""
                                    type=""
                                    placeholder="Reps"
                                    required
                                />
                                <Input
                                    id=""
                                    type=""
                                    placeholder="Weight"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    id=""
                                    type=""
                                    placeholder="Reps"
                                    required
                                />
                                <Input
                                    id=""
                                    type=""
                                    placeholder="Weight"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    id=""
                                    type=""
                                    placeholder="Reps"
                                    required
                                />
                                <Input
                                    id=""
                                    type=""
                                    placeholder="Weight"
                                    required
                                />
                            </div>

                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full">
                    Log Set
                </Button>
            </CardFooter>
        </Card>
    )
}
