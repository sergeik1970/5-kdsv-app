export const login = (req, res) => {
    console.log("Данные на вход:", req.body);
    res.send("Login работает")
}

export const register = (req, res) => {
    console.log("Данные на регистрацию:", req.body);
    res.send({
        message: "Регистрация работает"
    })
}