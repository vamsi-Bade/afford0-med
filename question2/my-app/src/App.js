import "./App.css";
import { useState } from "react";
import axios from "axios";
const baseURL = "http://localhost:5000/";
function App() {
  const [backendData, setBackendData] = useState([{}]);
  axios.get(`${baseURL}/trains`).then((response) => {
    setBackendData(response.data);
  });
  console.log(backendData);
  return <div className="App"></div>;
}

export default App;
