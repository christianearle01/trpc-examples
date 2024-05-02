"use client";

import { trpc } from "@/server/client";
import { useState } from "react";

export default function Home() {
  const getUsers = trpc.user.getUsers.useQuery();
  const addUser = trpc.user.addUser.useMutation({
    onSettled: () => {
      getUsers.refetch();
    }
  });

  const [name, setName] = useState<string>("");
  const [race, setRace] = useState<string>("");

  return (
    <main className="flex flex-col items-center justify-between p-24">
      {JSON.stringify(getUsers.data)}
      <div className="flex flex-col gap-3">
        Name: {" "}
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text" 
          className="border" 
        />
        Race: {" "}
        <input 
          value={race}
          onChange={(e) => setRace(e.target.value)}
          type="text" 
          className="border" 
        />
        <button 
          type="button" 
          className="border" 
          onClick={() => addUser.mutate({ name, race })}
        >
          Add
        </button>
      </div>
    </main>
  );
}
