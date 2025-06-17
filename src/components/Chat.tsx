"use client";

import { type Message, useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Weather } from "@/components/ui/weather";
import React, { useEffect, useRef, useState } from "react";
import { Exercise } from "./ui/exercise";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkoutStore } from "@/hooks/useWorkoutStore";
import { exerciseTool, tools } from "@/ai/tools";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "src/components/ui/accordion";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

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

            async onToolCall({ toolCall }) {
                if (toolCall.toolName === "getLocation") {
                    const cities = [
                        "New York",
                        "Los Angeles",
                        "Chicago",
                        "San Francisco",
                    ];
                    return cities[Math.floor(Math.random() * cities.length)];
                }
                if (toolCall.toolName === "giveWorkout") {
                    console.log(`chattsx tool call`)
                    const result = await exerciseTool.execute({}, {
                        toolCallId: toolCall.toolCallId,
                        messages: messages as any, // or transform them later
                    });
                    if (result !== undefined) {
                        addExercise(result);
                    }
                    return result;
                }
            },
        });

    const bottomRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    console.log("Exercises:", exercises);


    return (
        <div className="w-full">
            <div className="flex h-[calc(100vh)] w-full">
                {/* Exercises message area */}
                <ScrollArea className="w-1/2 bg-green-100 overflow-y-auto ">
                    <div className="sticky top-0 bg-white p-2 border-b justify-items-center font-bold">
                        <h2>Exercises for Today</h2>
                    </div>
                    <div className="justify-items-center">
                        <Accordion
                            type="single" collapsible
                            className="mt-4"
                        >

                            {exercises.map((exercise, index) => (
                                <AccordionItem
                                    value={`item-${index}`}
                                    className="mt-2"
                                >

                                    <Card className="">
                                        <AccordionTrigger
                                            className="w-110">
                                            <CardHeader
                                                className=""
                                            >
                                                <CardTitle
                                                    className="text-lg"
                                                >{exercise.name}</CardTitle>
                                                <CardDescription
                                                    className="w-100"
                                                >
                                                    Leg Press is great for getting those sweet sweet toned thighs.
                                                </CardDescription>
                                            </CardHeader>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className=" justify-items-center">
                                                <Exercise
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
                <ScrollArea className="w-1/2 rounded-md overflow-y-auto ">
                    <div className="sticky top-0 bg-white p-2 border-b justify-items-center font-bold">
                        <h2>Your Personal BodyBot</h2>
                    </div>
                    {/* Scrollable message area */}
                    <div className="p-2">

                        {messages.map((message) => (
                            <div
                                className="mx-auto my-2 w-full max-w-md rounded-xl bg-blue-100 p-4 text-sm"
                                key={message.id}
                            >
                                <div className="font-bold pb-4">
                                    {message.role === "user" ? "User" : "BodyBot"}
                                </div>
                                {message.parts.map((part) => {
                                    switch (part.type) {
                                        case "text":
                                            return <div key={part.text}>{part.text}</div>;

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
