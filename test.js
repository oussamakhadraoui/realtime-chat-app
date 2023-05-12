Forgot.js:import React, { useState } from "react";
import "./ForgotPassword.css";
import axios from "axios";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
     
     axios
       .post("http://localhost:5000/api/auth/forgot-password", { email })
       .then((response) => {
         console.log(response.data);
       })
       .catch((error) => {
         console.error(error);
       });

    
     
    // Afficher un message de succès
    setSuccessMessage(
      "Un email de réinitialisation du mot de passe a été envoyé à votre adresse."
    );
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Mot de passe oublié</h2>
        {successMessage ? (
          <div className="success-message">{successMessage}</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse email"
              required
            />
            <button type="submit">Réinitialiser le mot de passe</button>
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
Reset.js :import React, { useState } from "react";
import "./Reset.css";
import axios from "axios";
const Reset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

 const handleSubmit = async (e) => {
   e.preventDefault();

   if (password !== confirmPassword) {
     setErrorMessage("Les mots de passe ne correspondent pas.");
   } else {
     try {
       const resetToken = window.location.pathname.split("/").pop();
       const response = await axios.post(
         `http://localhost:5000/api/auth/reset-password/${resetToken}`,
         {
           password,
         }
       );
       console.log(response.data); 
       
     } catch (error) {
       console.error(error);
    
     }
   }
 };
  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <h2>Réinitialisation du mot de passe</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nouveau mot de passe"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmer le mot de passe"
            required
          />
          <button type="submit">Réinitialiser le mot de passe</button>
        </form>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Reset;



APP.js :
import React from "react";
import Login from "./Components/Login/Login";
import ForgotPassword from "./Components/ForgotPassword";
import Reset from "./Components/Reset";
import Contact from "./Components/Contact/Contact";
import Gestion from "./Components/Gestion/Gestion";
import Listes from "./Components/Listes/Listes";
import Why from "./Components/Why/Why";
import Toutes from "./Toutes/Toutes";
import User from "./Components/User/User";
import Admin from "./Components/Admin/Admin";
import Signup from "./Components/Signup/Signup";
import Footer from "./Components/Footer/Footer";
import Numerisation from "./Components/Numerisation/Numerisation";
import Navbar from "./Components/Navbar/Navbar";
import { Routes, Route, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Validation from "./Components/Signup/Signup";
import Scanner from "./Components/Scanner/Scanner";
import ActivationPage from "./Components/ActivationPage";
import "react-toastify/dist/ReactToastify.css";
import ProtectedAdminRoutes from "./layouts/AdminProtectedRoutes";
import ProtectedUserRoutes from "./layouts/UserProtectedRoutes";
import AddUser from "./Components/Listes/AddUser";
import AddDoc from "./Components/Numerisation/AddDoc";
import EditDoc from "./Components/Numerisation/EditDoc";
import "bootstrap/dist/css/bootstrap.min.css";
import EditUser from "./Components/Listes/EditUser";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const detectLogin = async () => {
    const userData = localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null;
    if (!userData && window.location.pathname == "/login") {
      navigate("/login", { replace: true });
    }
    if (!userData && window.location.pathname == "/") {
      navigate("/login", { replace: true });
    }
    if (userData && userData.isAdmin == true) {
      navigate("/Admin", { replace: true });
    }
    if (userData && userData.isAdmin == false) {
      navigate("/User", { replace: true });
    }
  };
  useEffect(() => {
    detectLogin();
  }, []);
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/reset/:resetToken" element={<Reset />} />
        <Route path="/" element={<Toutes />} />
        <Route path="/Gestion" element={<Gestion />} />
        <Route path="/Numerisation" element={<Numerisation />} />

        <Route path="/ForgotPassword" element={<ForgotPassword />} />

        <Route path="/Why" element={<Why />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Why" element={<Why />} />
        <Route path="/Scanner" element={<Scanner />} />
        <Route path="/AddDoc" element={<AddDoc />} />
        <Route path="/EditDoc" element={<EditDoc />} />
        <Route path="/Login" element={<Login />} />

        <Route
          path="/add_user"
          element={
            <ProtectedAdminRoutes>
              <AddUser />
            </ProtectedAdminRoutes>
          }
        />
        <Route
          path="/User"
          element={
            <ProtectedUserRoutes>
              {" "}
              <User />
            </ProtectedUserRoutes>
          }
        />
        <Route
          path="/EditDoc"
          element={
            <ProtectedAdminRoutes>
              <EditUser />
            </ProtectedAdminRoutes>
          }
        />
        <Route
          path="/Admin"
          element={
            <ProtectedAdminRoutes>
              {" "}
              <Admin />
            </ProtectedAdminRoutes>
          }
        />

        <Route path="/Listes" element={<Listes />} />
        <Route path="/Validation" element={<Validation />} />

        <Route path="/chkPatchCodeType" element={<chkPatchCodeType />} />

        <Route path="/Confirm/:activationCode" element={<ActivationPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
