import { BrowserRouter,Routes, Route } from 'react-router-dom';
import './styles/global.css';
import { Main } from './pages/user/main';

function App() {
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Main/>} />
          </Routes>
      </BrowserRouter>
      
    </>
  );
}

export default App;
