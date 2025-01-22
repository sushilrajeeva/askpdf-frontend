import React from "react";
import Upload from "./components/Upload";
import Chat from "./components/Chat";

const App: React.FC = () => {
    return (
        <div>
            <h1>PDF Chat AI</h1>
            <Upload />
            <Chat />
        </div>
    );
};

export default App;
