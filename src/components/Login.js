import { React, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    let navigate = useNavigate();
    const host = "http://localhost:5000";
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = `${host}/api/auth/login`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });
        const json = await response.json();
        console.log(json);
        if (json.Success) {
            //save the auth token and redirect
            localStorage.setItem('token', json.token)
            navigate('/')
        }
        else{
            alert("please Enter valid credentials");
        }
    }
    const handleClick = ()=>{
        navigate('/Signup')
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
                                    <h2 className="card-title mb-4">Login</h2>
                                </div>
                                <div className="mt-3 mx-4 my-4 ">
                                    <form onSubmit = {handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label"><strong>Email Address</strong></label>
                                            <input type="email" autoComplete="on" className="form-control" value = {credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label"><strong>Password</strong></label>
                                            <input type="password" autoComplete="on" className="form-control" value = {credentials.password} onChange={onChange} name="password" id="password" />
                                        </div>
                                        <div className='mb-2'>
                                            <Link to="/Forgot">Forgot Password?</Link>
                                        </div>
                                        <button type="submit" className="btn btn-primary my-2">Login</button>
                                        <br/>
                                        <button type="submit" onClick = {handleClick} className="btn btn-primary my-2">Signup</button>
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

export default Login