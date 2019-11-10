import Link from "next/link";

const Page = () => (
  <div className="container">
    <div className="bg-dark p-2 text-white">
      <h1>Quadratic Voting</h1>
    </div>
    <div
      className="d-flex justify-content-center align-items-center bg-light p-0"
      style={{ minHeight: 500 }}
    >
      <div className="w-50">
        <div className="text-center p-4" style={{ fontSize: "1.5em" }}>
          Create an election for your friends, teams or organisation in seconds.
          Your voters can vote from any device from any location.
        </div>
        <div>
          <Link href="/create">
            <button className="btn btn-dark btn-block">
              Create an Election
            </button>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Page;
