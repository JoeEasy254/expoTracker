import { onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ChromeIcon, MountainIcon } from "lucide-react";
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
    


 <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="space-y-4">
          <MountainIcon className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to ExpoTrack</h1>
          <p className="text-muted-foreground">Effortlessly track your expenses and stay on top of your finances.</p>
        </div>
        <div className="mt-6">
          <Button onClick={onSignIn} variant="outline" className="flex w-full items-center justify-center gap-2">
            <ChromeIcon className="h-5 w-5" />
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
