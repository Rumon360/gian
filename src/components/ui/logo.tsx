import Link from "next/link";

function Logo() {
  return (
    <Link
      href="/"
      prefetch={false}
      className="group text-xl rounded-md font-bold overflow-hidden"
    >
      <div className="group">
        <span>G</span>
        <span className="relative inline-block">
          <span className="inline-block group-hover:-translate-y-full transition duration-300">
            ia
          </span>
          <span className="absolute text-primary -bottom-[100%] group-hover:-translate-y-[100%] transition duration-200 left-0 right-0">
            ai
          </span>
        </span>
        <span>n</span>
      </div>
    </Link>
  );
}

export default Logo;
