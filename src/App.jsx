import Actions from "./components/Actions";
import Graph from "./components/Graph";
import { ModeToggle } from "./components/mode-toggle";
import Recent from "./components/Recent";
import Total from "./components/Total";
import TransactionList from "./components/TransactionList";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase/config";
import { useNavigate } from "react-router-dom";

function App() {
  // const { user } = useLoaderData();
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/sign-in");
      }
      setUser(user);
    });
  }, []);

  return (
    <>
      <Toaster />
      <div className="m-3">
        <ModeToggle />
      </div>
      <h1 className="mx-5 text-center font-bold text-3xl text-green-600">
        welcome {user.displayName}
      </h1>
      <div className="flex items-center mx-5">
        <Total userId={user.uid} />
        <Actions userId={user.uid} />
      </div>
      <div className=" mx-auto md:w-[950px] flex gap-4 mt-[17px]">
        <div className="flex flex-col space-y-5 ">
          <div>
            <TransactionList userId={user.uid} />
          </div>
          <hr />
          <div>
            <Recent userId={user.uid} />
          </div>
        </div>
        <div>
          <Graph userId={user.uid} />
        </div>
      </div>
      <h1 className="fixed mx-2 font-light italic m-2 text-blue-300">
        Built by Joseph😎
      </h1>
    </>
  );
}

export default App;
