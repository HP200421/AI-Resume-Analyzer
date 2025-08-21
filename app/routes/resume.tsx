import { Link, useNavigate, useParams } from "react-router"
import type { Route } from "../+types/root"
import { useEffect, useState } from "react"
import { usePuterStore } from "~/lib/puter"
import Summary from "~/components/Summary"
import ATS from "~/components/ATS"
import Detatils from "~/components/Details"

export function meta({ }: Route.MetaArgs) {
    return [
        { "title": "ResumeMate | Review" },
        { "name": "description", "content": "Boost your job search with AI-powered resume reviews that deliver clear, detailed insights and guidance" }
    ]
}

export default function Resume() {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const { id } = useParams()
    const [resumeUrl, setResumeUrl] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [feedback, setFeedback] = useState<Feedback | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading])

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`)

            if (!resume) return;
            const data = JSON.parse(resume)

            const resumeBlob = await fs.read(data.resumePath)
            if (!resumeBlob) return

            const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" })

            const resumeUrl = URL.createObjectURL(pdfBlob)
            setResumeUrl(resumeUrl)

            const imageBlob = await fs.read(data.imagePath)
            if (!imageBlob) return

            const imageFile = new Blob([imageBlob], { type: "application/pdf" })

            const imageUrl = URL.createObjectURL(imageFile)
            setImageUrl(imageUrl)

            if (data.feedback) {
                setFeedback(data.feedback)
            }
        }

        loadResume()
    }, [id])
    return <main className="!pt-0">
        <nav className="resume-nav">
            <Link to="/" className="back-button">
                <img src="/icons/back.svg" alt="Logo" className="w-2.5 h-2.5" />
                <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
            </Link>
        </nav>
        <div className="flex flex-row w-full max-lg:flex-col-reverse">
            <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
                {imageUrl && resumeUrl && (<div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit">
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                        <img src={imageUrl} alt="Resume Image" className="w-full h-full object-contain rounded-2xl" title="Resume" />
                    </a>
                </div>)}
            </section>
            <section className="feedback-section">
                <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
                {feedback ? (
                    <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                        Resume Scorecard
                        <Summary feedback={feedback} />
                        <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                        <Detatils feedback={feedback} />
                    </div>
                ) : (
                    <img src="/images/resume-scan-2.gif" alt="Resume Scan" className="w-full" />
                )}
            </section>
        </div>
    </main>
}