import { SignUpForm } from "@/components/sign-up-form"

export default function SignUpPage() {


    return (
        <>
            <div className="relative w-screen h-screen overflow-hidden">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                >
                    <source src="/splash/color-spin-2-smooth.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* sign up card */}
                <div className="absolute inset-0 flex min-h-svh flex-col justify-center gap-6 p-14 md:p-10 z-10">
                    <div className="flex w-full max-w-sm flex-col gap-4 items-center">
                        <div className="text-8xl/12 text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                            SuperBod
                        </div>
                        <div className="text-white">
                            Exercise like you&aposre a superhero.
                        </div>
                        <SignUpForm />
                    </div>
                </div>
            </div>
        </>

    )
}


