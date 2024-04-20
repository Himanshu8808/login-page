import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Forgot = () => {
    const [credentials, setCredentials] = useState({ email: ""});
    let navigate = useNavigate();
    const host = "http://localhost:5000";
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `${host}/api/auth/forgot-password`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials.email }),
        });
        const json = await response.json();

        if (json.Success) {
            navigate('/Rpass')
        }
        else{
            alert("Invalid Email");
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
                                            <label htmlFor="email" className="form-label"><strong>Email Address</strong></label>
                                            <input type="email" autoComplete="on" className="form-control" value = {credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
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

export default Forgot