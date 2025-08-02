import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUsername, setEmail, setPassword, resetRegister } from "./redux/slices/registerSlice";
import "./Register.css";

const apiUrl = import.meta.env.VITE_API_URL;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, email, password } = useSelector((state) => state.register);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${apiUrl}/register`, { username, email, password }, { withCredentials: true })
      .then((res) => {
        dispatch(resetRegister());
        navigate("/login");
      })
      .catch((err) => {
        alert("Registration failed. Please try again.");
        console.log(err);
      });
  };

  return (
    <div className="signup_container">
      <div className="signup_form">
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit} className="form_signup">
          <div>
            <label htmlFor="name">Имя:</label> <br />
            <input
              type="text"
              placeholder="Введите имя..."
              value={username}
              onChange={(e) => dispatch(setUsername(e.target.value))}
            />
          </div>
          <br />
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
          <button className="signup_btn" disabled={!username || !email || !password}>
            Зарегистрироваться
          </button>
        </form>
        <p className="form-p">Уже есть аккаунт?</p>
        <Link to="/login"><button>Вход</button></Link>
      </div>
    </div>
  );
};

export default Register;
