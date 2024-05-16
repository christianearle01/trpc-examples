import React, { Fragment, useState } from "react";
import "./App.css";
import { trpc } from "./trpc";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  /* Login state data */
  const [login_email_address, setLoginEmailAddress] = useState("");
  const [login_password, setLoginPassword] = useState("");
  /* Register state data */
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email_address, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");

  /* Prepare the procedures/functions to be used */
  const register = trpc.user.register.useMutation();
  const loginUser = trpc.user.loginUser.useMutation({
      onSuccess: () => {
          navigate("/wall");
      }
  });

  const handleLoginSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    /* Execute the loginUser procedure */
    loginUser.mutate({ email_address: login_email_address, password: login_password });
    setLoginEmailAddress('');
    setLoginPassword('');
    event.preventDefault();
  };

  const handleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    /* Execute the register procedure */
    register.mutate({ first_name, last_name, email_address, password, confirm_password });
    setFirstName('');
    setLastName('');
    setEmailAddress('');
    setPassword('');
    setConfirmPassword('');
    event.preventDefault();
  };

  return (
    <Fragment>
      <div className="row justify-content-center">
        <form 
          className="w-50 border border-primary-subtle rounded-4 p-3 mb-5 me-2" 
          onSubmit={handleLoginSubmit}
        >
          <h4>LOGIN</h4>
          <label htmlFor="email_address" className="form-label">Email Address:</label>
          <input
            name="email_address"
            type="text"
            className="form-control mb-3" 
            value={login_email_address}
            placeholder="email@address.com"
            onChange={(event) => setLoginEmailAddress(event.target.value)}
          />

          <label htmlFor="password" className="form-label">Password:</label>
          <input
            name="password"
            type="password"
            className="form-control mb-3" 
            value={login_password}
            placeholder="**************"
            onChange={(event) => setLoginPassword(event.target.value)}
          />

          <button type="submit" className="btn btn-primary">Login</button>
        </form>

        <form className="w-50 border border-primary-subtle rounded-4 p-3" onSubmit={handleRegisterSubmit}>
          <h4>REGISTER</h4>
          <label htmlFor="first_name" className="form-label">First Name</label>
          <input
            name="first_name"
            type="text"
            className="form-control mb-3" 
            value={first_name}
            onChange={(event) => setFirstName(event.target.value)}
          />

          <label htmlFor="last_name" className="form-label">Last Name</label>
          <input
            name="last_name"
            type="text"
            className="form-control mb-3" 
            value={last_name}
            onChange={(event) => setLastName(event.target.value)}
          />

          <label htmlFor="email_address" className="form-label">Email Address:</label>
          <input
            name="email_address"
            type="text"
            className="form-control mb-3" 
            value={email_address}
            placeholder="email@address.com"
            onChange={(event) => setEmailAddress(event.target.value)}
          />

          <label htmlFor="password" className="form-label">Password:</label>
          <input
            name="password"
            type="password"
            className="form-control mb-3" 
            value={password}
            placeholder="**************"
            onChange={(event) => setPassword(event.target.value)}
          />

          <label htmlFor="confirm_password" className="form-label">Confirm Password:</label>
          <input
            name="confirm_password"
            type="password"
            className="form-control mb-3" 
            value={confirm_password}
            placeholder="**************"
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      </div>
    </Fragment>
  );
};

export default App;
