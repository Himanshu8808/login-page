import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Rpass = () => {
    const [credentials, setCredentials] = useState({ newPassword: "", cpassword: "", otp: "" });
    let navigate = useNavigate();
    const host = "http://localhost:5000";
    const handleSubmit = async (e) => {
      e.preventDefault();
      const { newPassword, cpassword, otp } = credentials;
  
      // Check if password and confirm password match
      if (newPassword !== cpassword) {
        // Passwords do not match, show an error message
        alert("Passwords should be equal")
        return; // Exit the function early
      }
      const url = `${host}/api/auth/reset-password`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, cpassword, otp }),
      });
      const json = await response.json();

      if (json.Success) {
        alert("Password Reset Successfully")
        navigate('/Login')
      }
      else {
        alert("invalid OTP");
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
                                    <h2 className="card-title mb-4">Reset Password</h2>
                                </div>
                                <div className="mt-3 mx-4 my-4 ">
                                    <form onSubmit = {handleSubmit}>
                                    <div className="mb-3">
                                            <label htmlFor="password" className="form-label"><strong>New Password</strong></label>
                                            <input type="password" autoComplete="on" className="form-control" value = {credentials.newPassword} onChange={onChange} name="newPassword" id="password" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="cpassword" className="form-label"><strong>Confirm Password</strong></label>
                                            <input type="password" autoComplete="on" className="form-control" value = {credentials.cpassword} onChange={onChange} name="cpassword" id="cpassword" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label"><strong>OTP</strong></label>
                                            <input type="password" className="form-control" value = {credentials.otp} onChange={onChange} name="otp" id="otp" />
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

export default Rpass