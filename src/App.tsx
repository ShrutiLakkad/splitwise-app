import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "../src/features/styles/splitWise.scss";

import SplitWiseApp from "./features/spiltWise/components/group";
import HomePage from "./features/spiltWise/components/dashboard";

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
