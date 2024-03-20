import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../App.css";
import styles from "./styles.module.css";
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const getUser = (e) => {
    e.preventDefault();
    const { email, password } = user;
    if (email && password) {
      const url = `http://localhost:5555/user/login`;
      axios({
        method: "post",
        url: url,
        data: {
          email,
          password
        },
      })
        .then((res) => {
          const { token } = res.data;
          console.log(token);
          localStorage.setItem("token", token);
          const decodedToken = jwtDecode(token);

          if (decodedToken && decodedToken.role) {
            const roleId = decodedToken.role;
            // console.log(roleId);

            if (roleId === 1) {
              navigate("/admin/AdminDashboard");
            } else {
              navigate("/books");
            }
            toast.success("Login successful");
          } else {
            toast.error("Invalid token format or missing roleId");
          }
        })
        .catch((err) => {
          toast.error(err.response?.data?.message || "An error occurred while logging in");
        });
    } else {
      toast.error("Please provide both email and password.");
    }
  };

  return (
    <div className="main">
      <div className={styles.Login_container}>
        <div className={styles.Login_form_container}>
          <div className={styles.left}>
            <form className={styles.form_container} onSubmit={(e) => getUser(e)}>
              <h1>Login to Your Account</h1>
              <input
                type="email"
                placeholder="Enter your registered email"
                name="email"
                onChange={handleChange}
                value={user.email}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                onChange={handleChange}
                value={user.password}
                required
                className={styles.input}
              />
              <button type="submit" className={styles.green_btn}>
                Submit
              </button>
            </form>
          </div>
          <div className={styles.right}>
            <h1>New User ?</h1>
            <button
              type="button"
              className={styles.white_btn}
              onClick={() => navigate("/signup")}
            >
              Register Here
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
