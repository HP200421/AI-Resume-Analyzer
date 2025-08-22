import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "AI Resume Analyzer for Potential Job Seekers" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore()
  const navigate = useNavigate()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loadingResume, setLoadingResume] = useState(false)

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResume(true)

      const resumes = (await kv.list('resume:*', true)) as KVItem[]

      const parseResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))

      setResumes(parseResumes || [])
      setLoadingResume(false)
    }

    loadResumes()
  }, [])

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Smart Tracking for Your Job Hunt & Resume Feedback</h1>
        {!loadingResume && resumes.length == 0 ? (<h2>No resumes found. Upload your first resme to get feedback</h2>) : (<h2>AI That Speaks HR's Language</h2>)}
      </div>

      {
         loadingResume && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" alt="Resume Loadinf" className="w-[200px]" />
          </div>
        )
      }

      {!loadingResume && resumes.length > 0 &&
        (<div className="resumes-section">
          {resumes.map((resume) => (
            <div>
              <ResumeCard key={resume.id} resume={resume} />
            </div>
          ))}
        </div>)
      }

      {!loadingResume && resumes.length == 0 && (
        <div className="flex flex-col justify-center items-center mt-10 gap-4">
          <Link to="/upload" className="primary-button w-fit text-2xl font-semibold">Upload Resume</Link>
        </div>
      )}
    </section>

  </main>
}
