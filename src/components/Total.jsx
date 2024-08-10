import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { doc, getDoc } from "firebase/firestore";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const data = [{ name: "Group A", value: 400 }];
export default function Total({ userId }) {
  console.log("userId", userId);
  // Prepare graphData based on the structure of your input data

  const [accountData, setAccountData] = useState({});

  async function getAccountData() {
    const data = await getDocument(db, "accounts", userId);

    setAccountData(data);
  }

  // Prepare graphData based on the structure of your input data

  useEffect(() => {
    getAccountData();
  }, [userId]);

  // Prepare graphData based on the structure of your input data
  const graph = accountData?.monthlyAccountSavings?.map((item) => {
    return {
      month: item.month,
      monthlyTarget: parseInt(item.monthlyTarget),
    };
  });

  return (
    <div style={{ position: "relative", width: "800px", height: "400px" }}>
      <PieChart width={800} height={400}>
        <Pie
          data={graph}
          cx={120}
          cy={200}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={
            (1 -
              parseInt(accountData?.depositAmount) /
                parseInt(accountData?.savingTarget)) *
            100
          }
          dataKey="monthlyTarget"
        >
          {graph?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-390%, -50%)",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>
          <CountUp
            end={accountData?.depositAmount}
            duration={2.75}
            decimal=","
            prefix="Ksh "
          />
        </p>
      </div>
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
