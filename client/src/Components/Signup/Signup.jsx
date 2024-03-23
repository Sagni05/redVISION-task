import { useState } from "react";
import "../../App.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";
import { onTostifyFailure, onTostifySuccess } from "../tosify/Tostify";

const Signup = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    contactNo: "",
    password: "",
    confirmPass: ""
  });

  // console.log(user);

  const registerUser = (e) => {
    e.preventDefault();
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const createUser = (e) => {
    e.preventDefault();
    const { fullName, email, contactNo, password, confirmPass } = user;
    if ((fullName, email, contactNo, password, confirmPass)) {
      const url = `http://localhost:5555/user/signUp`;
      axios({
        method: "post",

        url: url,

        data: {
          fullName,
          email,
          contactNo,
          password,
          confirmPass
        },
        headers: {
          Accept: "application/json"
        }
      })
        .then((res) => {
          onTostifySuccess(res.data.message);
          // localStorage.setItem("token", response.data.token);
          navigate("/");
        })
        .catch((err) => {
          onTostifyFailure(err.response.data.message);
        });
    } else {
      onTostifyFailure("Please provide both all inputs.");
    }
  };

  return (
    <div className="main">
      <div className={styles.Signup_container}>
        <div className={styles.Signup_form_container}>
          <div className={styles.left}>
            <h1>Welcome Back</h1>
            <Link to="/">
              <button type="button" className={styles.white_btn}>
                Sign In
              </button>
            </Link>
          </div>
          <div className={styles.right}>
            <form
              className={styles.form_container}
              onSubmit={(e) => createUser(e)}
            >
              <h1>Create Account</h1>
              <input
                type="text"
                placeholder="Full Name"
                name="fullName"
                value={user.fullName}
                onChange={registerUser}
                required
                className={styles.input}
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={user.email}
                onChange={registerUser}
                required
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Contact Number"
                name="contactNo"
                value={user.contactNo}
                onChange={registerUser}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={user.password}
                onChange={registerUser}
                required
                className={styles.input}
              />
              <input
                type="password"
                placeholder="Confirm password"
                name="confirmPass"
                value={user.confirmPass}
                onChange={registerUser}
                required
                className={styles.input}
              />

              <button type="submit" className={styles.green_btn}>
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
