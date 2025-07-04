
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toEmbedUrl } from "@/lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import type { Exercise } from "@/types/exercise";

export function ExerciseCard({ name, youtubeShort, description }: Exercise) {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <>
            < Card className="max-w-lg mt-5" >

                <CardHeader>
                    <iframe
                        className="w-full aspect-video pb-4 rounded-md"
                        src={youtubeShort ? toEmbedUrl(youtubeShort) : ""}
                        title={`Exercise video for ${name}`}
                        allowFullScreen
                    />
                    <Collapsible
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        className="flex flex-col gap-2">
                        <div>
                            <CollapsibleTrigger className="flex justify-between gap-4">
                                <Label className="">
                                    Exercise Description
                                </Label>
                                <Button variant="ghost" size="icon" className="size-8">
                                    <ChevronsUpDown />
                                    <span className="sr-only">Toggle</span>
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent>
                            <CardDescription className="max-w-full">
                                {description}
                            </CardDescription>
                        </CollapsibleContent>
                    </Collapsible>
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
                        Complete Exercise
                    </Button>
                </CardFooter>
            </Card >
        </>
    )
}
