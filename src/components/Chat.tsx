"use client";

import { type Message, useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Weather } from "@/components/ui/weather";
import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkoutStore } from "@/hooks/useWorkoutStore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "src/components/ui/accordion";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import ReactMarkdown from "react-markdown"
import { getMuscleGroupImage } from "@/lib/dictionary";
import Image from 'next/image'
import type { Exercise } from "@/types/exercise";
import { ExerciseCard } from "./ExerciseCard";
import { MenuBarNav } from "./MenuBarNav";


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

    const bottomRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        console.log("📩 Messages updated:", messages);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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



    return (

        <div className="w-full">
            <div className="absolute z-100 py-8 px-5">
                <MenuBarNav />
            </div>
            <div className="flex h-[calc(100vh)] w-full">
                {/* Exercises message area */}
                <ScrollArea className="w-2/3 bg-green-100 overflow-y-auto">
                    <div className="sticky top- p-7 justify-items-center text-5xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        <h2>Exercises for Today</h2>
                    </div>
                    <div className="justify-items-center">
                        <Accordion
                            type="single" collapsible
                            className="mt-4"
                        >

                            {exercises.map((exercise, index) => (
                                <AccordionItem
                                    key={exercise.id}
                                    value={`item-${index}`}
                                    className="mt-2"
                                >

                                    <Card className="">
                                        <div className="">
                                            <AccordionTrigger
                                                className="w-210">
                                                <CardHeader>
                                                    <div className="flex flex-row items-center">
                                                        {/*image here */}
                                                        <div className="w-30 h-60 overflow-hidden mr-6">
                                                            <Image
                                                                src={getMuscleGroupImage(exercise.muscleGroup ?? "default")}
                                                                alt="Image of muscle group"
                                                                className="w-full h-full object-cover"
                                                                width="500"
                                                                height="500"
                                                            />
                                                        </div>
                                                        <div className="">
                                                            <CardTitle
                                                                className="text-lg w-full"
                                                            >
                                                                {exercise.name}
                                                            </CardTitle>
                                                            <CardDescription
                                                                className="w-100"
                                                            >
                                                                Target: {exercise.muscleGroup}
                                                            </CardDescription>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                            </AccordionTrigger>

                                        </div>

                                        <AccordionContent>
                                            <div className=" justify-items-center">
                                                <ExerciseCard
                                                    key={exercise.id} {...exercise} />
                                            </div>
                                        </AccordionContent>
                                    </Card>
                                </AccordionItem>

                            ))}
                        </Accordion>

                    </div>
                </ScrollArea>
                {/* Messages message area */}
                <ScrollArea className="w-1/3 rounded-md overflow-y-auto">
                    <div className="sticky top-0 bg-white p-7 justify-items-center text-5xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        <h2>Your Personal BodyBot</h2>
                    </div>
                    {/* Scrollable message area */}
                    <div className="p-2">

                        {messages.map((message) => (
                            <div
                                className="mx-auto my-2 w-full max-w-md rounded-xl bg-blue-100 p-4"
                                key={message.id}
                            >
                                <div className="font-bold pb-4">
                                    {message.role === "user" ? "User" : "BodyBot"}
                                </div>
                                {message.parts.map((part) => {
                                    switch (part.type) {
                                        case "text":
                                            return <div
                                                className="text-lg/8"
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
                                                            return <div key={callId}>Exercise Added!</div>;


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
                        <form
                            onSubmit={handleSubmit}
                            className="sticky bottom-0 flex p-8 w-full"
                        >
                            <div className="flex w-full">
                                <Input
                                    className="mr-2 flex-1 bg-white"
                                    name="prompt"
                                    value={input}
                                    onChange={handleInputChange}
                                />
                                <Button type="submit">Submit</Button>
                            </div>
                        </form>
                    </div>

                    {/* Input form fixed at bottom */}


                </ScrollArea>
            </div >



        </div >
    );
}
