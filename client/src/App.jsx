import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { setUser } from './redux/slices/userSlice'
import "./App.css"
import Home from './Home'
import Navbar from './Navbar'


const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const dispatch = useDispatch();

  // Автоотправление cookie
  axios.defaults.withCredentials = true;
  // useEffect для получения данных с сервера
  useEffect(() => {
    // Получение данных с сервера
    axios.get(apiUrl)
      .then(user => {
        dispatch(setUser(user.data))
        console.log(user)
      })
      .catch(err => console.log("Ошибка при получении пользователя: ", err))

  }, [])

  const user = useSelector((state) => state.user);


  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
