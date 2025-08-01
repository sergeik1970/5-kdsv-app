import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setEmail, setPassword, resetLogin } from "./redux/slices/loginSlice";
import { setUser } from "./redux/slices/userSlice";

const apiUrl = import.meta.env.VITE_API_URL;

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { email, password } = useSelector((state) => state.login);

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${apiUrl}/login`, { email, password })
      .then((res) => {
        if (res.data.username) {
          dispatch(setUser(res.data));
          dispatch(resetLogin());
          navigate("/");
        } else {
          alert("Неверный логин или пароль");
        }
      })
      .catch((err) => {
        alert("Ошибка при входе");
        console.log(err);
      });
  };

  return (
    <div className="signup_container">
      <div className="signup_form">
        <h2>Вход</h2>
        <form onSubmit={handleSubmit} className="form_signup">
          <div>
            <label htmlFor="email">Электронная почта:</label> <br />
            <input
              type="email"
              placeholder="Введите почту..."
              value={email}
              onChange={(e) => dispatch(setEmail(e.target.value))}
            />
          </div>
          <br />
          <div>
            <label htmlFor="password">Пароль:</label> <br />
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => dispatch(setPassword(e.target.value))}
            />
          </div>
          <button className="signup_btn" disabled={!email || !password}>
            Войти
          </button>
        </form>
        <p className="form-p">Не зарегистрированы?</p>
        <Link to="/register"><button>Регистрация</button></Link>
      </div>
    </div>
  );
}

export default Login;