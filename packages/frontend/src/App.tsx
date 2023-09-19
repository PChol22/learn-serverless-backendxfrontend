import { useEffect, useState } from 'react'

function App() {
  const [users, setUsers] = useState<{ firstName: string; lastName: string; email: string }[]>([]);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const syncUsers = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/users`);
    const body = await res.json() as { firstName: string; lastName: string; email: string }[];

    setUsers(body);
  }


  useEffect(() => {
    void syncUsers();
  }, [])

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email }),
    });
    setUsers([...users, { firstName, lastName, email }]);
    await syncUsers();
  }

  return (
    <div>
      <div>
        <h1>Users</h1>
        <form onSubmit={onFormSubmit}>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
          />
          <button type="submit">Submit</button>
        </form>
      </div>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email Address</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ email, firstName, lastName }) => (
            <tr key={email}>
              <td>{firstName}</td>
              <td>{lastName}</td>
              <td>{email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  )
}

export default App
