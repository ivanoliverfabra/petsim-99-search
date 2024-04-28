export default function Navbar() {
  return (
    <div className="h-14 w-screen border-b text-white flex items-center justify-between backdrop-blur-md fixed top-0 bg-slate-700/5 px-2 lg:px-10">
      <h1 className="text-2xl">PS99 Search</h1>
      <div className="flex items-center space-x-4">
        <p>
          Not associated with{" "}
          <a
            href="https://www.biggames.io/"
            className="underline"
            target="_blank"
          >
            Big Games
          </a>
        </p>
      </div>
    </div>
  );
}
