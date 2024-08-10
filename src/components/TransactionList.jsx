import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Badge } from "@/components/ui/badge";

export default function TransactionList({ userId }) {
  const [accountData, setAccountData] = useState([]);

  async function getAccountData() {
    const data = await getDocument(db, "withdraw", userId);
    setAccountData(data);
  }

  useEffect(() => {
    getAccountData();
  }, [userId]);

  console.log("accountDATA", accountData);

  return (
    <div>
      <h1 className="my-3 italic ">Withdrawals</h1>
      <div class="overflow-y-auto max-h-[50vh]">
        <table class="min-w-full text-sm">
          <thead class="bg-gray-200 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10">
            <tr>
              <th class="p-2 text-left">Date</th>
              <th class="p-2 text-left">Amount</th>
              <th class="p-2 text-left">Type</th>
              {/* <th class="p-2 text-left">Actions</th> */}
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 overflow-y-auto h-[10vh]">
            {accountData.map((data) => (
              <tr key={data?.id}>
                <td class="p-2">{formatTime(data?.date)}</td>
                <td class="p-2">{data?.withdrawalAmount}</td>
                <td class="p-2">
                  <Badge variant="destructive"> withdraw</Badge>
                </td>
                {/* <td class="p-2">
                  <a href="#" class="text-indigo-600 hover:text-indigo-900">
                    View
                  </a>
                  <a href="#" class="ml-2 text-red-600 hover:text-red-900">
                    Delete
                  </a>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function getDocument(db, collectionName, userId) {
  const q = query(
    collection(db, collectionName),
    where("userId", "==", userId)
  );

  const querySnapshot = await getDocs(q);
  let data = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots

    data.push(doc.data());
  });
  return data;
}

function formatTime(firebaseTimestamp) {
  // Convert to milliseconds
  const milliseconds =
    firebaseTimestamp.seconds * 1000 + firebaseTimestamp.nanoseconds / 1000000;

  // Create a Date object
  const date = new Date(milliseconds);

  // Format the date to a readable format
  const readableDate = date.toLocaleString(); // Example: "8/10/2024, 1:23:04 PM"

  return readableDate;
}
