import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { setUser } from './redux/slices/userSlice'
import "./App.css"
import Home from './Home'
import Navbar from './Navbar'
import Register from './Register'
import Login from './Login'
import CreatePost from './CreatePost'
import Post from './Post'
import EditPost from './EditPost'


const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const dispatch = useDispatch();

  // Автоотправление cookie
  axios.defaults.withCredentials = true;
  // useEffect для получения данных с сервера
  // useEffect(() => {
  //   // Получение данных с сервера
  //   axios.get(apiUrl)
  //     .then(user => {
  //       dispatch(setUser(user.data))
  //       console.log(user)
  //     })
  //     .catch(err => console.log("Ошибка при получении пользователя: ", err))

  // }, [])

  useEffect(() => {
  axios.get(`${apiUrl}/me`, { withCredentials: true })
    .then(res => {
      if (res.data.username) {
        dispatch(setUser(res.data));
      }
    })
    .catch(err => {
      console.log("Пользователь не авторизован");
    });
}, []);

  const user = useSelector((state) => state.user);


  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/create" element={<CreatePost />}></Route>
        <Route path='/post/:id' element={<Post />}></Route>
        <Route path='/editpostbyid/:id' element={<EditPost />}></Route> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
