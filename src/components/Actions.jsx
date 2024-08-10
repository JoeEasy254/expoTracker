import Account from "./Banking/Account";
import Withdraw from "./Banking/WithDraw";

export default function Actions({ userId }) {
  return (
    <div className="flex space-x-5">
      <Account userId={userId} />

      <Withdraw userId={userId} />
    </div>
  );
}
