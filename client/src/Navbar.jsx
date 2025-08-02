import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import "./Navbar.css";

function Navbar() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const user = useSelector((state) => state.user);

    const navigate = useNavigate();

    const handleLogout = () => {
        axios.get(`${apiUrl}/logout`, {
            withCredentials: true
        })
            .then(res => {
                if (res.data === 'Success')
                    navigate(0)
            }).catch(err => { console.log(err) });
    }

    return (
        <nav className='navbar'>
            <div className="nav-content">
                <h3>KDSV App</h3>
                <div>
                    <a href="/" className='link'>Главная</a>
                    {
                        user.username ?
                            <Link to="/create" className='link'>Новая запись</Link>
                            : <></>
                    }
                    <Link to="/contacts" className="link">Контакты</Link>
                </div>
                {
                    user.username ?
                        <div>
                            <span>{user.username}</span>&nbsp;
                            <input type="button" onClick={handleLogout} value='Выйти' className='btn_input' />
                        </div>
                        :
                        <div><Link to="/register" className="link">Регистрация/Вход</Link></div>
                }
            </div>
        </nav>
    )
}

export default Navbar;