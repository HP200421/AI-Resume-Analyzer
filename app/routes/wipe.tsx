import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);
    const [statusText, setStatusText] = useState<string | null>(null)

    const loadFiles = async () => {
        const files = (await fs.readDir("./")) as FSItem[];
        setFiles(files);
    };

    useEffect(() => {
        loadFiles();
    }, []);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading]);

    const handleDelete = async () => {
        files.forEach(async (file) => {
            await fs.delete(file.path);
        });
        await kv.flush();
        loadFiles();
        setStatusText("All data has been successfully wiped!")
        setTimeout(() => setStatusText(null), 5000)
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error {error}</div>;
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover flex flex-col items-center">
            <h2 className="mb-2">Hello {auth.user?.username},</h2>
            <div className="text-center mb-2 w-[400px]">Need more space? Remove all resumes and generated images by clicking <b>Wipe App Data</b>.
                {statusText ? (<p className="bg-green-200 mb-2 mt-2 rounded-md p-2">{statusText}</p>) : (<p className="bg-red-200 mb-2 mt-2 rounded-md p-2"><b>Warning:</b> This will permanently delete data.</p>)
                }
            </div >
            <div>
                <button
                    className="primary-button"
                    onClick={() => handleDelete()}
                >
                    Wipe App Data
                </button>
            </div>
        </main >
    );
};

export default WipeApp;