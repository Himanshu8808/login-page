import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null); // State variable to hold user data
  let navigate = useNavigate();

  const getuser = async () => {
    try {
      const host = "http://localhost:5000";
      const url = `${host}/api/auth/getuser`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
      });

      if (!response.ok) { // Handle non-200 status codes gracefully
        throw new Error(`API request failed with status ${response.status}`);
      }

      const user = await response.json();
      setUser(user); // Update state with fetched user data
    } catch (error) {
      console.error('Error fetching user:', error); // Log errors for debugging
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Login')
  }
  const handleClick = () => {
    localStorage.removeItem('token');
    navigate('/Login')
  }

  useEffect(() => {
    getuser(); // Run getuser on component mount
  }, []);

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center" style={{ backgroundImage: `linear-gradient( #ffc0cb, #800080)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card cbg">
              <div className="card-body">
                {user ? (<>
                  <div className="text-center"><strong><h1>Hello, {user.name}!</h1></strong></div>
                  <div className="text-center">
                    <button type="button" onClick={handleLogout} className="btn btn-primary">Logout</button>
                  </div>
                </>
                ) : (<>
                  <div className="text-center"><strong><h1>Login to access the secured message</h1></strong></div>
                  <div className="text-center">
                    <button type="button" onClick={handleClick} className="btn btn-primary">Login</button>
                  </div>
                </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
