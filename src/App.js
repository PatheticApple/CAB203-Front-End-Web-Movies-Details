import './App.css';
import { BrowserRouter, Route, Routes, Link} from 'react-router-dom'


import Header from "./Components/Header";

import Movies from "./Pages/Movies";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import MoviePage from './Pages/MoviePage';
import PeoplePage from './Pages/PeoplePage'
import SearchMovies2 from './Pages/MoviesSearch'
import Footer from './Components/Footer';

import "./index.css";
export default function App() {
  
  return (
    <BrowserRouter>
    <div className="App">
      <Header/>
      
      <Routes>
       
        <Route path='/' element={<Home/>}></Route>
        <Route path='/Movies' element={<Movies/>}></Route>
        <Route path='/Register' element={<Register/>}></Route>
        <Route path='/Login' element={<Login/>}></Route>
        <Route path='/MoviePage' element={<MoviePage/>}></Route>
        <Route path='/PeoplePage' element={<PeoplePage/>}></Route>
        <Route path='/MovieSearch' element={<SearchMovies2/>}></Route>

      </Routes>
    <Footer/>
    </div>
    </BrowserRouter>
  );
}


