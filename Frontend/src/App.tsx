import './App.css';
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import LandingPage from './Pages/LandingPage';
import SingleBookPage from './Pages/SingleBookPage';
function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/books/:id' element={<SingleBookPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
