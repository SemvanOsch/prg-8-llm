import React, {useEffect, useRef, useState} from "react";

export default function ChatPage() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([])
    const randomPokemonId = Math.floor(Math.random() * 151) + 1;

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
        <div className="min-h-screen max-h-screen overflow-x-hidden bg-blue-100 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')] bg-repeat px-4 py-12 pb-36 font-sans">
            <div className="max-w-2xl mx-auto bg-white shadow-2xl border-4 border-blue-600 rounded-2xl p-8 relative">

                <h1 className="text-4xl font-bold text-center text-blue-800 mb-6 tracking-wide">
                    ⚔️ Pokémon Battle Log
                </h1>

                {/* Chat messages */}
                <div className="space-y-4 mb-6 overflow-y-auto max-h-[60vh] pr-2 scrollbar-thin scrollbar-thumb-blue-500">
                    {history.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-xl shadow-inner border-2 ${
                                msg.role === "user"
                                    ? "bg-yellow-200 border-yellow-500 text-yellow-900"
                                    : "bg-gray-100 border-gray-400 text-gray-800"
                            }`}
                        >
                            <strong className="block text-xs uppercase mb-1 tracking-widest text-blue-700 font-mono">
                                {msg.role === "user" ? "Trainer" : "Champion"}
                            </strong>
                            {msg.content}
                        </div>
                    ))}
                    {response && (
                        <div className="p-4 rounded-xl shadow-inner border-2 bg-gray-100 border-gray-400 text-gray-800">
                            <strong className="block text-xs uppercase mb-1 tracking-widest text-blue-700 font-mono">
                                Champion
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
                    className="fixed bottom-0 inset-x-0 bg-blue-100 border-t-4 border-blue-600 px-4 py-4 flex flex-col sm:flex-row gap-4 z-50 backdrop-blur-md shadow-lg"
                >
                    <input
                        className="flex-grow px-4 py-3 border-2 border-blue-600 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-blue-50 text-blue-900 placeholder-blue-700 font-mono"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder='Type something like: "Go Charizard!" or "Use Flamethrower!"'
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-3 rounded-lg font-black tracking-wide text-white transition font-mono ${
                            loading
                                ? "bg-blue-400 cursor-wait"
                                : "bg-blue-700 hover:bg-blue-800"
                        }`}
                    >
                        {loading ? "Battling..." : "Send Move!"}
                    </button>
                </form>
            </div>
        </div>

    );
}
