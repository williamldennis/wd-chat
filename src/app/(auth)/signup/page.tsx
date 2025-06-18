import { BicepsFlexed, GalleryVerticalEnd } from "lucide-react"

import { SignUpForm } from "@/components/sign-up-form"

export default function SignUpPage() {


    return (
        <>
            <div className="relative w-screen h-screen overflow-hidden">
                {/* <img
                    src="/splash/color-spin-2.gif"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                /> */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                >
                    <source src="/splash/color-spin-2.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* sign up card */}
                <div className="absolute inset-0 flex min-h-svh flex-col justify-center gap-6 p-14 md:p-10 z-10">
                    <div className="flex w-full max-w-sm flex-col gap-6">
                        <a href="#" className="flex items-center gap-2 self-center font-medium text-white text-2xl">
                            {/* <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                                <BicepsFlexed className="size-4" />
                            </div> */}
                            <div className="text-8xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                                SuperBod
                            </div>
                        </a>
                        <SignUpForm />
                    </div>
                </div>
            </div>
        </>

    )
}


