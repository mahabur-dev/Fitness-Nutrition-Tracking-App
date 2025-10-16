
const register = async (req, res) => {
    res.status(201).send({
        message: "User registered successfully",
        data: req.body
    });
};

const login = async (req, res) => {
    res.send("Login endpoint");
};
const logout = async (req, res) => {
    res.send("Logout endpoint");
}

export { register, login, logout };