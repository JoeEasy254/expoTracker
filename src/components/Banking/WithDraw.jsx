import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { HandCoins } from "lucide-react";
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
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function Withdraw({ userId }) {
  const navigate = useNavigate();
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [accountData, setAccountData] = useState(null);
  const [reason, setReason] = useState("");

  async function getAccountData() {
    const data = await getDocument(db, "accounts", userId);

    setAccountData(data);
    stopLoading();
  }

  useEffect(() => {
    getAccountData();
  }, [userId]);

  async function executeWithdrawal(e) {
    e.preventDefault();

    if (
      withdrawalAmount <= 0 || // Added check for zero amount
      withdrawalAmount === "" ||
      accountData.depositAmount < 1
    ) {
      return toast.error("There is nothing to withdraw");
    }

    const docRef = doc(db, "accounts", userId);
    try {
      const account = { ...accountData };
      if (
        account.hasOwnProperty("depositAmount") &&
        parseInt(account.depositAmount) < 1
      ) {
        toast.error("Nothing to withdraw");
        return;
      } else {
        let depAmount = parseInt(account.depositAmount);
        depAmount -= parseInt(withdrawalAmount);

        // Check for overdraw scenario
        if (depAmount < 0) {
          toast.error("Insufficient funds");
          return;
        }

        // Perform the withdrawal and update the document
        try {
          // Create a withdrawal record
          const withdraw = {
            withdrawalAmount: withdrawalAmount,
            reason: reason,
            date: new Date(),
            userId: userId,
          };

          await addDoc(collection(db, "withdraw"), withdraw);

          // Update the account's deposit amount
          await updateDoc(docRef, {
            depositAmount: depAmount,
          });

          toast.success("Withdrawal successful");
          navigate(0); // Refresh or redirect after success
        } catch (error) {
          console.log("withdrawal-[error]", error);
          toast.error("Failed to process withdrawal");
        }
      }
    } catch (error) {
      console.log("update doc[error]", error);
      toast.error("Failed to update account");
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button>
            <HandCoins /> Withdraw
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Card className="w-full max-w-md border-none">
            <CardHeader>
              <CardTitle>Transfer</CardTitle>
              <CardDescription>withdraw from account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium">
                  <Button variant="secondary" disabled size="sm">
                    Balance
                  </Button>
                  <span>{accountData?.depositAmount}</span>
                </div>
              </div>
              <div className="grid gap-2">
                <form onSubmit={executeWithdrawal}>
                  <Label htmlFor="withDrawal Amount">Withdraw</Label>
                  <div className="flex items-center gap-2 flex-col space-y-3">
                    <Input
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      id="withdrawAmount"
                      type="number"
                      placeholder="Ksh50"
                    />

                    <textarea
                      id="message"
                      rows="4"
                      class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                  >
                    Withdraw
                  </Button>
                </form>
              </div>
            </CardContent>
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
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
}
