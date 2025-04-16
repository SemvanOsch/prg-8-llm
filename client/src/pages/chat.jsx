import React, {useEffect, useRef, useState} from "react";

export default function ChatPage() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([])
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [response]);
    const getChat = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: {
                    Accept: "text/plain",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt, history }),
            });

            historySetter("user", prompt)

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let result = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                result += chunk;
                setResponse((prev) => prev + chunk);
            }

            historySetter("ai", result)

            setResponse("")
            setPrompt("");
        } catch (e) {
            setError("Er is een fout opgetreden: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const historySetter = (role, content) => {
        setHistory(prev => [
            ...prev,
            { role: role, content: content },
        ]);
    }

    return (
        <div className="min-h-screen max-h-screen bg-yellow-100 bg-[url('https://www.transparenttextures.com/patterns/old-map.png')] bg-repeat px-4 py-12 pb-36 font-pirate">
            <div className="max-w-2xl mx-auto bg-[#fdf6e3] shadow-2xl border-4 border-yellow-700 rounded-2xl p-8 relative">

                <h1 className="text-4xl font-pirate text-center text-yellow-900 mb-6 tracking-wide">
                    ☠️ Kapitein's Chatlog
                </h1>

                {/* Chat messages */}
                <div className="space-y-4 mb-6 overflow-y-auto max-h-[60vh] pr-2 scrollbar-pirate">
                {history.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-xl shadow-inner border-2 ${
                                msg.role === "user"
                                    ? "bg-yellow-200 border-yellow-600 text-yellow-900"
                                    : "bg-gray-100 border-gray-400 text-gray-800"
                            }`}
                        >
                            <strong className="block text-xs uppercase mb-1 tracking-widest text-yellow-700 font-pirate">
                                {msg.role === "user" ? "Kapitein" : "Orakel"}
                            </strong>
                            {msg.content}
                        </div>
                    ))}
                    {response && (
                        <div className="p-4 rounded-xl shadow-inner border-2 bg-gray-100 border-gray-400 text-gray-800">
                            <strong className="block text-xs uppercase mb-1 tracking-widest text-yellow-700 font-pirate">
                                Orakel
                            </strong>
                            {response}
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {error && <p className="text-red-700 text-sm mb-4">{error}</p>}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        getChat();
                    }}
                    className="fixed bottom-0 left-0 w-full bg-yellow-100 border-t-4 border-yellow-700 px-4 py-4 flex flex-col sm:flex-row gap-4 z-50 backdrop-blur-md shadow-lg"
                >
                    <input
                        className="flex-grow px-4 py-3 border-2 border-yellow-700 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-600 transition bg-yellow-50 text-yellow-900 placeholder-yellow-700 font-pirate"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Spreek, kapitein..."
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-3 rounded-lg font-black tracking-wide text-white transition font-pirate ${
                            loading
                                ? "bg-yellow-400 cursor-wait"
                                : "bg-yellow-700 hover:bg-yellow-800"
                        }`}
                    >
                        {loading ? "Aan het vuren..." : "Afvuren!"}
                    </button>
                </form>
            </div>
        </div>
    );

}
