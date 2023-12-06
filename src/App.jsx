import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'

import PageHome from './home/PageHome'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PageHome></PageHome>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  )

}

export default App;
