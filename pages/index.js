import Link from "next/link";

const Page = () => (
  <div className="container">
    <div className="row bg-dark p-2 text-white">
      <h1>Quadratic Voting</h1>
    </div>
    <div
      className="row d-flex align-items-center bg-light p-0"
      style={{ minHeight: "80vh" }}
    >
      <div className="col-3"></div>
      <div className="col-12 col-sm-6">
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
      <div className="col-3"></div>
    </div>
  </div>
);

export default Page;
