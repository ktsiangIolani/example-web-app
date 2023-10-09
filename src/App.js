import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  //------------------------------- STATES ------------------------------------

  const [message, setMessage] = useState(null);
  const [name, setName] = useState("");

  //------------------------------- API CALLS ------------------------------------
  // Test request to see if the server is running
  // useEffect will make it run once when the app starts up
  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then((response) => response.json())
      .then((text) => setMessage(text.message));
  }, []);

  // Fetches the list of users from the database
  const getUsers = () => {
    fetch("http://localhost:5000/api/users")
      .then((response) => response.json())
      .then((data) =>
        setMessage(data.users.map((user) => user.name).join(", "))
      )
      .catch((error) => console.error(error));
  };

  // Adds a new user to the database by name
  const addUser = (event) => {
    event.preventDefault();
    fetch("http://localhost:5000/api/users/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessage(message + ", " + data.user.username);
        setName("");
      });
  };

  // resets the users table in the database
  const resetUsers = () => {
    fetch("http://localhost:5000/api/users/reset", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) =>
        setMessage(data.users.map((user) => user.name).join(", "))
      )
      .catch((error) => console.error(error));
  };

  //------------------------------- COMPONENTS ------------------------------------

  const GetUsersButton = () => {
    return (
      <button type="button" onClick={getUsers}>
        Get users
      </button>
    );
  };

  const ResetUSersButton = () => {
    return (
      <button type="button" onClick={resetUsers}>
        Reset users
      </button>
    );
  };

  //------------------------------- RENDER ------------------------------------
  return (
    <div className="App">
      <div className="App-header">
        <p>{message}</p>
        <form onSubmit={addUser}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
        <GetUsersButton />
        <ResetUSersButton />
      </div>
    </div>
  );
}

export default App;
