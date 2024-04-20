import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
  let navigate = useNavigate();
  const host = "http://localhost:5000";
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword } = credentials;

    // Check if password and confirm password match
    if (password !== cpassword) {
      // Passwords do not match, show an error message
      alert("Passwords should be equal")
      return; // Exit the function early
    }
    const url = `${host}/api/auth/createuser`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const json = await response.json();
    console.log(json);
    if (json.Success) {
      //save the auth token and redirect
      localStorage.setItem('token', json.token)
      navigate('/Login')
    }
    else {
      alert("invalid credentials");
    }
  }
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center" style={{ backgroundImage: `linear-gradient( #ffc0cb, #800080)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card cbg">
              <div className="card-body">
                <div className="text-center">
                  <h2 className="card-title mb-4">Signup</h2>
                </div>
                <div className="mt-3 mx-4 my-4 ">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label"><strong>Name</strong></label>
                      <input type="text" placeholder='Min 3 characters' className="form-control" id="name" name="name" onChange={onChange} aria-describedby="emailHelp" />
                    </div>
                    <div className="mb-3">
                    <label htmlFor="email" className="form-label"><strong>Email Address</strong></label>
                    <input type="email" placeholder="Enter a valid email" className="form-control" id="email" name="email" onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label"><strong>Password</strong></label>
                    <input type="password" placeholder="Min 8 characters" className="form-control" id="password" name="password" onChange={onChange} minLength={8} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label"><strong>Confirm Password</strong></label>
                    <input type="password" placeholder="Min 8 characters" className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={8} required/>
                </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup