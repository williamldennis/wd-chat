"use client";

import { type Message, useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Weather } from "@/components/ui/weather";
import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkoutStore } from "@/hooks/useWorkoutStore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "src/components/ui/accordion";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { user } from "auth-schema";

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
                <div className="max-w-xs z-110 py-8 px-5">
                    <MenuBarNav />
                </div>
                {/* Exercises area */}
                <div className="w-full flex flex-col">
                    <div className="">
                        {exercises.length != 0 && (
                            <>
                                <div className="sticky text-white z-50 justify-items-center text-5xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                    <h2>{exercises?.length} Exercises for Today</h2>
                                </div>
                                <div className="w-screen h-screen overflow-hidden absolute inset-0">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src="/splash/polygon-bg.gif"
                                            alt="Image of muscle group"
                                            className="w-full h-full object-cover"
                                            width="500"
                                            height="500"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-white/50 z-10 backdrop-blur-xl" />
                                    </div>
                                </div>
                            </>

                        )}
                        <div className="text-white z-100" >
                            {exercises.length === 0 && (
                                <>
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
                                            <div className="absolute inset-0 bg-white/10 z-10" />
                                        </div>
                                    </div>
                                    <div className="relative w-full flex items-center justify-center">


                                        <div className="relative z-10 bg-black/50 rounded-3xl p-10 backdrop-blur-md mt-50">
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

                                </>
                            )}
                        </div>
                    </div>


                    <div className="justify-center flex w-full relative">
                        {exercises.length != 0 && (
                            <Carousel
                                className="w-3/4 z-10 mt-20"
                                plugins={[
                                    Autoplay({
                                        delay: 2000,
                                    }),
                                ]}
                            >
                                <CarouselContent className="">

                                    {exercises.map((exercise, index) => (
                                        <CarouselItem
                                            key={exercise.id}
                                            className="mt-2 basis-1/1"
                                        >
                                            <div className="">
                                                <CardHeader>
                                                    <div className="justify-items-center">
                                                        {/*image here */}
                                                        <div className="h-120 lg:h-120 lg:w-60 lg:overflow-hidden items-center">
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
                                                                <DrawerContent className="p-3 mb-20 bg-black/60 backdrop-blur-md flex items-center z-50">
                                                                    <div className="z-100">
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
                        )}
                    </div>
                </div>
                {/* Chat bot message area */}
                <div className="pointer-events-none">
                    <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerContent className="pointer-events-auto z-50">
                            <div className="sticky top-0 bg-white justify-items-center p-3" >
                                <div className="text-5xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Your Personal BodyBot</div>
                                <div>Chat with me about your workout goals</div>
                            </div>
                            <ScrollArea className="rounded-md overflow-y-auto pb-[90px]">

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
                                                            case "askForConfirmation": {
                                                                const args = part.toolInvocation.args as {
                                                                    message: string;
                                                                };
                                                                switch (part.toolInvocation.state) {
                                                                    case "call":
                                                                        return (
                                                                            <div key={callId}>
                                                                                {args.message}
                                                                                <div className="mt-2">
                                                                                    <Button
                                                                                        className="mr-2 bg-green-400"
                                                                                        onClick={() =>
                                                                                            addToolResult({
                                                                                                toolCallId: callId,
                                                                                                result: "Yes, confirmed",
                                                                                            })
                                                                                        }
                                                                                    >
                                                                                        Yes
                                                                                    </Button>
                                                                                    <Button
                                                                                        className="bg-gray-400"
                                                                                        onClick={() =>
                                                                                            addToolResult({
                                                                                                toolCallId: callId,
                                                                                                result: "No, denied",
                                                                                            })
                                                                                        }
                                                                                    >
                                                                                        No
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    case "result":
                                                                        return (
                                                                            <div key={callId}>
                                                                                Location access allowed:{" "}
                                                                                {part.toolInvocation.result}
                                                                            </div>
                                                                        );
                                                                }
                                                                break;
                                                            }

                                                            case "getLocation": {
                                                                switch (part.toolInvocation.state) {
                                                                    case "call":
                                                                        return <div key={callId}>Getting location...</div>;
                                                                    case "result":
                                                                        return (
                                                                            <div key={callId}>
                                                                                Location: {part.toolInvocation.result}
                                                                            </div>
                                                                        );
                                                                }
                                                                break;
                                                            }

                                                            case "displayWeather": {
                                                                switch (part.toolInvocation.state) {
                                                                    case "call":
                                                                        return <div key={callId}>Loading weather...</div>;
                                                                    case "result":
                                                                        return (
                                                                            <div key={callId}>
                                                                                <Weather {...part.toolInvocation.result} />
                                                                            </div>
                                                                        );
                                                                }
                                                                break;
                                                            }

                                                            case "giveWorkout": {
                                                                switch (part.toolInvocation.state) {
                                                                    case "call":
                                                                        return <div key={callId}>Loading workout...</div>;
                                                                    case "result":
                                                                        return <div key={callId} className="flex flex-col justify-between">
                                                                            <div className="mt-4 self-end">
                                                                                <Button
                                                                                    onClick={() => setOpen(false)}
                                                                                    className="w-100"
                                                                                >
                                                                                    Show me the exercises</Button>
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

                                {/* Input form fixed at bottom */}
                                <div className="">
                                    {!exerciseDrawerIsOpen && (
                                        <form
                                            onSubmit={handleSubmit}
                                            className="fixed bottom-0 left-0 w-full bg-white/40 backdrop-blur-lg  border-gray-200 p-4 z-900"
                                        >
                                            <div className="flex w-full z-800">
                                                <Input
                                                    onFocus={() => setOpen(true)}
                                                    className="mr-2 flex-1 bg-white"
                                                    name="prompt"
                                                    value={input}
                                                    onChange={handleInputChange}
                                                    placeholder="Tap here to get absolutely swoll"
                                                />
                                                <Button onClick={() => setOpen(true)}>Send</Button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </ScrollArea>
                        </DrawerContent>

                    </Drawer>
                </div>
                {!exerciseDrawerIsOpen && (
                    <form
                        onSubmit={handleSubmit}
                        className="fixed bottom-0 left-0 w-full bg-white/40 backdrop-blur-lg  border-gray-200 p-4 z-900"
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
                            <Button onClick={() => setOpen(true)}>Send</Button>
                        </div>
                    </form>
                )}
            </div >
            {/* Message Submit Form */}



        </div >
    );
}

