import React from "react";
import "../src/features/styles/splitWise.scss";

import SplitWiseApp from "./features/spiltWise/components/group";
import HomePage from "./features/spiltWise/components/dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/settle-up" element={<SplitWiseApp />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
