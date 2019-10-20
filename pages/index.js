import Link from "next/link";

const Page = () => (
  <div>
    <p>Welcome to the Quadratic Voting app!</p>
    <Link href="/create">
      <button>Create an Election</button>
    </Link>
  </div>
);

export default Page;
