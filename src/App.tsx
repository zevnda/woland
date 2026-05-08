import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {

  async function sendWOL() {
    
    try {
      const result = await invoke<string>("send_wake_on_lan");
      console.log(result);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  return (
    <main className="app-container">
      <div className="button-wrapper">
        <div
          className="power-button"
          onClick={sendWOL}
          title="Send Wake-on-LAN packet"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
            <line x1="12" y1="2" x2="12" y2="12"></line>
          </svg>
        </div>
      </div>
    </main>
  );
}

export default App;
