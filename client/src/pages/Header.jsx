import { useState } from "react";
import { useAppContext } from "../context/appContext";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/images/turn-off.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode to decode JWT token

function Header() {
  const { setQuery } = useAppContext();
  const navigate = useNavigate();

  // Extract user's role from token stored in localStorage
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const userRole = decodedToken ? decodedToken.role : null;

  const logout = () => {
    localStorage.removeItem("token");
    toast.success("User logged out successfully");
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand as={Link} to="/books">Books Application</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link as={Link} to="/books">Home</Nav.Link>
            <Nav.Link as={Link} to="/favorites">Your Favourite books</Nav.Link>
            {/* Conditionally render "Add Book" navigation item based on user's role */}
            {userRole === 1 && <Nav.Link as={Link} to="/admin/add-book">Add Book</Nav.Link>}
            <Nav.Link onClick={logout} style={{ display: "flex", alignItems: "center" }}>
              Logout
              <img src={logo} alt="" style={{ height: "20px", width: "20px", marginLeft: "5px" }} />
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search books"
              className="me-2"
              aria-label="Search"
              onChange={(e) => setQuery(e.target.value)}
            />
          </Form>
        </Navbar.Collapse>
      </Container>
      <ToastContainer />
    </Navbar>
  );
}

export default Header;
