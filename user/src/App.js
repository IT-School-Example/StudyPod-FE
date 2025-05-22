import { BrowserRouter,Routes, Route } from 'react-router-dom';
import './styles/global.css';
import { MainPage } from './pages/MainPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { SearchPage } from './pages/SearchPage';
import { MyPage } from './pages/MyPage';
import { CreateGroupPage } from './pages/CreateGroupPage';

function App() {
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<MainPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/signup' element={<SignupPage/>}/>
            <Route path='/search' element={<SearchPage/>}/>
            <Route path='/profile' element={<MyPage/>}/>
            <Route path='/create-group' element={<CreateGroupPage/>}/>
          </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
