
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog";


export function ExerciseCard({ name, youtubeShort, description }: Exercise) {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <>
            {/* <div className="flex p-4 pb-6">
                <div className="flex flex-col">
                    {youtubeShort &&
                        <iframe
                            className="w-full h-full pb-4 rounded-lg aspect-video"
                            src={youtubeShort ? toEmbedUrl(youtubeShort) : ""}
                            title={`Exercise video for ${name}`}
                            allowFullScreen
                        />
                    }
                    <div className="mt-5">
                        <form className="">
                            <div className="flex flex-col">
                                <div className="grid gap-2">
                                    <Label htmlFor="" className="text-lg font-bold">Reps & Weight</Label>
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
                        <div className="flex-col mt-4">
                            <Button type="submit" className="w-120">
                                Log Set
                            </Button>
                        </div>
                    </div>

                </div>
                <div>
                    <div className="max-w-sm pl-8 pb-2 text-4xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        {name}
                    </div>
                    <div className="max-w-sm pl-8">
                        {description}
                    </div>

                </div>

            </div> */}



            < Card className="w-full mt-5" >

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
                        Log Set
                    </Button>
                </CardFooter>
            </Card > 
        </>
    )
}
