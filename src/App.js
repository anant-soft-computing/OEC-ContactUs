import React from "react";
import ReactDOM from "react-dom";
import ContactUsForm from "./components/ContactUsForm";

function App() {
  return <ContactUsForm />;
}

export default App;
ReactDOM.render(<App />, document.getElementById("root"));