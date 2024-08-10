import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
const provider = new GoogleAuthProvider();
export default function SignIn() {
  const [user, setUser] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  const navigate = useNavigate();
  const onSignIn = () => {
    try {
      signInWithPopup(auth, provider)
        .then(async (user) => {
          // get doc reference
          const docRef = doc(db, "accounts", user.user.uid);

          // Retrieve the most up-to-date account data
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // Document exists, get the data
            navigate("/");
            return;
          } else {
            // create an account for this user
            const account = {
              name: user.user.displayName,
              userId: user.user.uid,
              depositAmount: 0,
              photo: user.user.photoURL,
              savingTarget: "",
              monthlyAccountSavings: [],
            };
            setDoc(doc(db, "accounts", user.user.uid), account)
              .then(() => {
                navigate("/");
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.log("error[sign-in]", errorMessage);
        });
    } catch (error) {
      console.log("error[sign-in]", error);
    }
  };
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <Card className="border ">
        <CardContent>
          <Button variant="secondary" onClick={onSignIn}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
