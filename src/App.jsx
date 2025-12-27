import { useEffect, useState } from "react";
import { getUsers, createUser } from "./api/users";

function App() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email) return;

    await createUser(email);
    setEmail("");
    loadUsers();
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Users</h2>

      <form onSubmit={submitHandler}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <button>Add</button>
      </form>

      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
