import ChatPage from "./pages/chat.jsx";
import React, {useState} from "react";
import RulesBot from "./pages/rulesBot.jsx";
function App() {

    return (
        <div className="min-h-screen max-w-screen bg-blue-100 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')] bg-repeat">
            <div className="flex flex-col md:flex-row gap-8 justify-center items-start w-full">
                <div className="w-full">
                    <ChatPage />
                </div>
                <div className="w-full">
                    <RulesBot />
                </div>
            </div>
        </div>
    );
}

export default App
