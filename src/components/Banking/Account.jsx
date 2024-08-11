import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Banknote } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useNavigate } from "react-router-dom";

export default function Account({ userId }) {
  const navigate = useNavigate();
  const [monthlyTarget, setMonthlyTarget] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [savingTargetAmount, setSavingTargetAmount] = useState("");
  const [accountData, setAccountData] = useState(null);

  async function getAccountData() {
    const data = await getDocument(db, "accounts", userId);

    setAccountData(data);
  }

  useEffect(() => {
    getAccountData();
  }, [userId]);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  async function setMonthTarget() {
    // Validate the monthly target
    if (monthlyTarget < 1) {
      toast.error("No target amount");
      return;
    }

    // Create the document reference
    const docRef = doc(db, "accounts", userId);

    try {
      // Clone the account data to avoid mutating the original object
      const account = { ...accountData };

      // Prepare the new data for the monthly target
      const newMonthlyData = {
        month: months[new Date().getMonth()],
        monthlyTarget: monthlyTarget,
      };

      // Initialize the monthlyAccountSavings array if it doesn't exist
      if (!account.monthlyAccountSavings) {
        account.monthlyAccountSavings = [];
      }

      // Append the new data to the monthlyAccountSavings array
      account.monthlyAccountSavings.push(newMonthlyData);

      // Update the document in Firestore
      await updateDoc(docRef, account);

      // Show success message and reload the page
      toast.success("Monthly target is set");
      navigate(0);
    } catch (error) {
      console.error("Failed to update document:", error);
      toast.error("An error occurred while setting the monthly target.");
    }
  }

  async function setDepAmount() {
    const docRef = doc(db, "accounts", userId);

    try {
      // Validate and parse the deposit amount
      const parsedDepositAmount = parseInt(depositAmount);

      if (isNaN(parsedDepositAmount) || parsedDepositAmount < 1) {
        toast.error("Invalid deposit amount");
        return;
      }

      // Retrieve the most up-to-date account data
      const docSnap = await getDoc(docRef);
      let account;

      if (docSnap.exists()) {
        // Document exists, get the data
        account = docSnap.data();
      } else {
        // Document doesn't exist, create a new one with initial deposit
        account = { depositAmount: 0 };
        await setDoc(docRef, account); // Create the document in Firestore
      }

      // Ensure depositAmount property exists and update it
      account.depositAmount += parsedDepositAmount;

      // Update Firestore document with the new deposit amount
      await updateDoc(docRef, { depositAmount: account.depositAmount });

      // Update state with the new data
      setAccountData(account);

      // Clear input field
      setDepositAmount("");

      // Record the deposit in a separate collection
      const depositRecord = {
        depositAmount: parsedDepositAmount,
        date: new Date(),
        userId: userId,
      };

      await addDoc(collection(db, "deposits"), depositRecord);

      // Show success message
      toast.success("Deposit amount is set");

      // Optional: Refresh the page or navigate
      navigate(0);
    } catch (error) {
      console.error("Failed to set deposit amount:", error);
      toast.error("Failed to set deposit amount");
    }
  }

  async function setSavingTarget() {
    if (savingTargetAmount < 1) {
      toast.error("No target amount");
      return;
    }
    const docRef = doc(db, "accounts", userId);

    try {
      const account = { ...accountData };
      account.savingTarget = "";
      let data = {
        savingTarget: savingTargetAmount,
      };
      if (account.hasOwnProperty("savingTarget")) {
        account.savingTarget = "";
        await updateDoc(docRef, {
          ...data,
        });

        toast.success("saving target is set");

        navigate(0);
      }
    } catch (error) {
      console.log("update doc[error]", error);
    }
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button>
            <Banknote /> Account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Card className="w-full max-w-md border-none">
            <CardHeader>
              <CardTitle>Savings Account</CardTitle>
              <CardDescription>Manage your monthly savings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="target">
                  Monthly Savings Target (for this month)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={monthlyTarget}
                    onChange={(e) => setMonthlyTarget(e.target.value)}
                    id="target"
                    type="number"
                    placeholder="(Ksh)100"
                  />
                  <Button onClick={setMonthTarget} variant="outline" size="sm">
                    Set Target
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deposit">Deposit</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    id="deposit"
                    type="number"
                    placeholder="(Ksh)50"
                  />
                  <Button onClick={setDepAmount} variant="outline" size="sm">
                    Deposit
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between flex-col space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="target">Savings Target Amount</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={savingTargetAmount}
                    onChange={(e) => setSavingTargetAmount(e.target.value)}
                    id="target"
                    type="number"
                    placeholder="(Ksh)100"
                  />
                  <Button onClick={setSavingTarget} variant="outline" size="sm">
                    Set Target
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}

async function getDocument(db, collection, docId) {
  const docRef = doc(db, collection, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());

    return docSnap.data();
  } else {
    console.log("No such document!");
  }
}
