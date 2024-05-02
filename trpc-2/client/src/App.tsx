import * as React from 'react';

import { trpc } from './trpc';

const App = () => {
  const [name, setName] = React.useState('');

  const { data, isLoading, refetch } = trpc.user.getUsers.useQuery();

  const mutation = trpc.user.createUser.useMutation({
    onSuccess: () => refetch(),
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setName(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setName('');
    mutation.mutate({ name });
    event.preventDefault();
  };

  if (isLoading) return <span>Loading ...</span>;

  return (
    <div>
      <ul>
        {(data ?? []).map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={handleChange}
        />

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default App;