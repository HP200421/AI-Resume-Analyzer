import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "AI Resume Analyzer for Potential Job Seekers" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { auth } = usePuterStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/")
  }, [auth.isAuthenticated])

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Smart Tracking for Your Job Hunt & Resume Feedback</h1>
        <h2>AI That Speaks HR's Language</h2>
      </div>

      {resumes.length > 0 &&
        (<div className="resumes-section">
          {resumes.map((resume) => (
            <div>
              <ResumeCard key={resume.id} resume={resume} />
            </div>
          ))}
        </div>)
      }
    </section>

  </main>
}
