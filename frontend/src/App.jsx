import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Working from './Components/MainWorking';
import Result from "./Components/Result";
import Header from "./Components/HeadernFooter/Header";
import Footer from "./Components/HeadernFooter/Footer";
import AboutUs from "./Components/AboutUs";
import LoginnSignUp from "./Components/LoginnSignUp"
import './App.css';
function App() {
    return (
        <Router>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <Header />
                <div style={{ flex: 1, overflow: "hidden" }}>
                    <Routes>
                        <Route path="/working" element={<Working />} />
                        <Route path="/result" element={<Result />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/login-signup" element={<LoginnSignUp />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}
export default App;