"use client";

import { type Message, useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkoutStore } from "@/hooks/useWorkoutStore";
import { CardDescription, CardHeader, CardTitle } from "./ui/card";
import ReactMarkdown from "react-markdown"
import { getMuscleGroupImage } from "@/lib/dictionary";
import Image from 'next/image'
import type { Exercise } from "@/types/exercise";
import { ExerciseCard } from "./Exercise-Card";
import { MenuBarNav } from "./MenuBarNav";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"

export default function Chat({
    id,
    initialMessages,
}: { id?: string | undefined; initialMessages?: Message[] } = {}) {

    const { exercises, addExercise } = useWorkoutStore()

    const { input, handleInputChange, handleSubmit, messages, addToolResult } =
        useChat({
            id,
            initialMessages,
            sendExtraMessageFields: true,
            maxSteps: 5,
        });


    //scroll logic for messages
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        console.log("📩 Messages updated:", messages);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    //update exercise array
    const handledResultsRef = useRef(new Set<string>());

    useEffect(() => {
        for (const message of messages) {
            for (const part of message.parts) {
                if (
                    part.type === "tool-invocation" &&
                    part.toolInvocation.toolName === "giveWorkout" &&
                    part.toolInvocation.state === "result"
                ) {
                    const callId = part.toolInvocation.toolCallId
                    if (!handledResultsRef.current.has(callId)) {
                        handledResultsRef.current.add(callId)
                        console.log("toll result in useEffect:", part.toolInvocation.result)
                        addExercise(part.toolInvocation.result as Exercise | Exercise[])
                        setOpen(false); // ✅ Close the drawer here
                    }
                }
            }
        }
    }, [messages, addExercise])
    console.log("Exercises:", exercises);


    //drawer logic for messages
    const [open, setOpen] = useState(false)

    //drawer logic for exercise drawer being open
    const [exerciseDrawerIsOpen, setExerciseDrawerIsOpen] = useState(false)

    return (

        <div className="w-full">

            <div className="flex flex-col items-center h-[calc(100vh)] w-full">
                <div className="max-w-xs z-1000 py-8 px-5">
                    <MenuBarNav />
                </div>
                {/* Exercises area */}

                <div className="w-full flex flex-col">
                    {/* With exercises */}
                    {exercises.length != 0 && (
                        <>
                            <div className="">
                                <>
                                    <div className="sticky text-white z-50 justify-items-center text-5xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                        <h2>{exercises?.length} Exercises for Today</h2>
                                    </div>
                                    <div className="w-screen h-screen overflow-hidden absolute inset-0">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src="/splash/polygon-bg.gif"
                                                alt="Background Splash"
                                                className="w-full h-full object-cover"
                                                width="500"
                                                height="500"
                                                unoptimized
                                            />
                                            <div className="absolute inset-0 bg-white/50 backdrop-blur-xl" />
                                        </div>
                                    </div>
                                </>
                            </div>


                            <div className="justify-center flex w-full relative">
                                <Carousel
                                    className="w-3/4 z-10 mt-20"
                                    plugins={[
                                        Autoplay({
                                            delay: 2000,
                                        }),
                                    ]}
                                >
                                    <CarouselContent className="">
                                        {exercises.map((exercise) => (
                                            <CarouselItem
                                                key={exercise.id}
                                                className="mt-2 basis-1/1 md:basis-1/2 lg:basis-1/3"
                                            >
                                                <div className="">
                                                    <CardHeader>
                                                        <div className="justify-items-center">
                                                            {/*image here */}
                                                            <div className="h-120 lg:h-120 lg:w-60 lg:overflow-hidden items-center ml-12">
                                                                <Image
                                                                    src={getMuscleGroupImage(exercise.muscleGroup ?? "default")}
                                                                    alt="Image of muscle group"
                                                                    className="w-full h-full object-cover"
                                                                    width="500"
                                                                    height="500"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col items-center">
                                                                <div>
                                                                    <CardTitle
                                                                        className="text-lg w-full"
                                                                    >
                                                                        {exercise.name}
                                                                    </CardTitle>
                                                                </div>

                                                                <CardDescription
                                                                    className="text-white"
                                                                >
                                                                    Target: {exercise.muscleGroup}
                                                                </CardDescription>
                                                                <Drawer
                                                                    onOpenChange={(isOpen) => setExerciseDrawerIsOpen(isOpen)}
                                                                >
                                                                    <DrawerTrigger>
                                                                        <Button className="m-4 bg-black/60 backdrop-blur-md">
                                                                            Start Exercise
                                                                        </Button>
                                                                    </DrawerTrigger>
                                                                    <DrawerContent className="max-h-[90vh] p-3 mb-20 bg-black/60 backdrop-blur-md flex items-center z-50">
                                                                        <div className="z-50">
                                                                            <ExerciseCard
                                                                                key={exercise.id} {...exercise}
                                                                            />
                                                                        </div>

                                                                    </DrawerContent>
                                                                </Drawer>
                                                            </div>
                                                        </div>
                                                    </CardHeader>

                                                </div>


                                            </CarouselItem>

                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>

                            </div>
                        </>

                    )}
                    <div className="text-white" >
                        {/* NO exercises */}
                        {exercises.length === 0 && (
                            <>
                                <div className="flex flex-col items-between justify-center">
                                    <div className="w-full h-screen overflow-hidden absolute inset-0">
                                        <div className="relative w-full h-full">
                                            <video
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                className="absolute inset-0 w-full h-full object-cover z-0"
                                            >
                                                <source src="/splash/posing.mp4" type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                            <div className="absolute inset-0 bg-white/10" />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col items-center mt-25 ">
                                        <div className="z-10 bg-black/50 rounded-3xl p-10 backdrop-blur-md flex flex-col items-center">
                                            <div className="text-5xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                                Start chatting with
                                            </div>
                                            <div className="text-5xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                                your personal bodybot
                                            </div>
                                            <div className="text-xl p-3">

                                                <ul className="flex flex-col gap-4 p-2">
                                                    <div className="text-xl font-bold py-2">
                                                        Say things like:
                                                    </div>
                                                    <li>&quot;I want a leg day&quot;</li>
                                                    <li>&quot;Help me improve my posture&quot;</li>
                                                    <li>&quot;I want to get stronger for tennis&quot;</li>
                                                    <li>&quot;Make me look better naked&quot;</li>
                                                </ul>
                                            </div>
                                        </div>

                                    </div>
                                </div>


                            </>
                        )}
                    </div>
                </div>
                {/* Chat bot message area */}
                <div className="">
                    <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerContent className="bg-white/30 backdrop-blur-2xl z-60 pb-[100px]">
                            <div className="sticky top-0 justify-items-center p-3 my-5 z-10">
                                <div className="text-5xl text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Your Personal BodyBot</div>
                                <div className="text-white">Chat with me about your workout goals</div>
                            </div>
                            <ScrollArea className="max-h-[80vh] rounded-md overflow-y-auto">

                                {/* Scrollable message area */}
                                <div className="p-2">

                                    {messages.map((message) => (
                                        <div
                                            className="mx-auto my-2 w-full max-w-md rounded-xl bg-blue-100 p-4"
                                            key={message.id}
                                        >
                                            <div className="font-bold">
                                                {message.role === "user" ? "User" : "BodyBot"}
                                            </div>
                                            {message.parts.map((part) => {
                                                switch (part.type) {
                                                    case "text":
                                                        return <div
                                                            className="pt-5 text-md"
                                                            key={part.text}
                                                        >
                                                            <ReactMarkdown>
                                                                {part.text}
                                                            </ReactMarkdown>
                                                        </div>;

                                                    case "tool-invocation": {
                                                        const callId = part.toolInvocation.toolCallId;

                                                        switch (part.toolInvocation.toolName) {
                                                            case "giveWorkout": {
                                                                console.log("State:", part.toolInvocation.state);
                                                                switch (part.toolInvocation.state) {

                                                                    case "call":
                                                                        return <div key={callId}>Loading workout...</div>;
                                                                    case "result":
                                                                        return <div key={callId} className="flex flex-col justify-between">
                                                                            <div className="mt-4">
                                                                                Found you some great ones.
                                                                            </div>
                                                                        </div>;

                                                                }
                                                                break;
                                                            }
                                                        }
                                                    }
                                                }
                                            })}
                                        </div>
                                    ))}

                                    {/* Invisible ref to scroll to */}
                                    <div ref={bottomRef} />

                                </div>
                            </ScrollArea>
                            <form
                                onSubmit={handleSubmit}
                                className="fixed bottom-0 left-0 w-full bg-white/40 backdrop-blur-lg  border-gray-200 p-4 z-500"
                            >
                                <div className="flex w-full z-800">
                                    <Input
                                        onFocus={() => setOpen(true)}
                                        className="mr-2 flex-1 bg-white"
                                        name="prompt"
                                        value={input}
                                        onChange={handleInputChange}
                                        placeholder="Chat here to get absolutely swoll"
                                    />
                                    <Button type="submit">Send</Button>
                                </div>
                            </form>
                        </DrawerContent>

                    </Drawer>
                </div>
            </div >
            {/* Message Submit Form */}
            <form
                onSubmit={handleSubmit}
                className="fixed bottom-0 left-0 w-full bg-white/40 backdrop-blur-lg  border-gray-200 p-4 z-500"
            >
                <div className="flex w-full z-800">
                    <Input
                        onFocus={() => setOpen(true)}
                        className="mr-2 flex-1 bg-white"
                        name="prompt"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Chat here to get absolutely swoll"
                    />
                    <Button type="submit">Send</Button>
                </div>
            </form>


        </div >
    );
}

