import logo from './logo.svg';
import './App.css';
import AppHeader from "./components/AppHeader/AppHeader";
import FDCalculator from "./components/FDCalculator/FDCalculator";

function App() {
  return (
    <div className="App">
      <AppHeader></AppHeader>
      <FDCalculator></FDCalculator>
    </div>
  );
}

export default App;
