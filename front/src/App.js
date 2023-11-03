import AtividadeForm from "components/AtividadeForm";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <>
      <ToastContainer />
      <AtividadeForm />
    </>
  );
}

export default App;
