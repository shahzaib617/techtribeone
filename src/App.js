import React from "react";
import WaveBackground from "./components/WaveBackground";
import Home from "./pages/Home";

function App() {
  return (
    <div>
      <WaveBackground />
      <div style={{ position: "relative",overflowY:"hidden", zIndex: 1, backgroundColor:"rgba(0,0,0,0.8)" }}>
      <Home />
      </div>
    </div>
  );
}

export default App;
