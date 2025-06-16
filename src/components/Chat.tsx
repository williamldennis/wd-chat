"use client";

import { type Message, useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Weather } from "@/components/ui/weather";
import React, { useEffect, useRef, useState } from "react";
import { Exercise } from "./ui/exercise";
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkoutStore } from "@/app/hooks/useWorkoutStore";
import { exerciseTool, tools } from "@/ai/tools";

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
                    const result = await exerciseTool.execute({}, {
                        toolCallId: toolCall.toolCallId,
                        messages: messages as any, // or transform them later
                    });
                    addExercise(result)
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
            <div className="flex">
                <ScrollArea className="bg-red-400">
                    <div className="grid grid-cols-1 gap-4">

                        {exercises.map((exercise) => (
                            <Exercise key={exercise.id} {...exercise} />
                        ))}
                    </div>

                </ScrollArea>
                <ScrollArea className="rounded-md p-4">

                    {/* Scrollable message area */}
                    <div className="">

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
                    </div>

                    {/* Input form fixed at bottom */}


                </ScrollArea>



            </div>

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
    );
}
