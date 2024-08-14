import Actions from "./components/Actions";
import Graph from "./components/Graph";
import { ModeToggle } from "./components/mode-toggle";
import DepositTable from "./components/DepositTable";
import Total from "./components/Total";
import WithdrawalTable from "./components/WithdrawalTable";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase/config";
import { useNavigate } from "react-router-dom";
import { useLoader } from "./context/LoaderContext";

function App() {
  const { loading, startLoading } = useLoader();
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    startLoading();
  }, []);
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

      <div
        className={`h-[100vh] flex justify-center items-center ${
          !loading ? "hidden" : "block"
        }`}
      >
        {loading && <span class="loader"></span>}
      </div>
      <div style={{ display: `${loading ? "none" : "block"}` }}>
        {/* <h1 className="mx-5 my-4 md:my-0 text-center font-bold text-3xl text-green-600 italic">
          welcome {user.displayName}
        </h1> */}
        <div className="flex md:items-center mx-5 ">
          <Actions userId={user.uid} />
        </div>
        <div className=" mx-auto md:w-[950px] flex flex-col space-y-5 md:space-y-0 md:flex-row gap-4 mt-[17px]">
          <div className="flex flex-col  space-y-5  mx-4 md:mx-0">
            <div>
              <WithdrawalTable userId={user.uid} />
            </div>
            <hr />
            <div>
              <DepositTable userId={user.uid} />
            </div>
          </div>
          <div>
            <Graph userId={user.uid} />
          </div>
        </div>

        <div>
          <Total userId={user.uid} />
        </div>
        <h1 className="fixed mx-2 font-light italic m-2 text-blue-300">
          Built by Joseph😎
        </h1>
      </div>
    </>
  );
}

export default App;
