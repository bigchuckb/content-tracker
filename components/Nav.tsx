import Link from "next/link";

export default function Nav() {
  return (
    <nav className="bg-[#2c3440] border-b border-[#445566]">
      <div className="max-w-4xl mx-auto px-4 flex items-center gap-6 h-12">
        <Link href="/" className="font-bold text-white text-sm tracking-widest uppercase hover:text-[#00e054] transition-colors">
          Tracked
        </Link>
        <div className="flex items-center text-sm">
          <NavLink href="/">Feed</NavLink>
          <NavLink href="/movies">Films</NavLink>
          <NavLink href="/books">Books</NavLink>
          <NavLink href="/tv">TV</NavLink>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 text-[#9ab] hover:text-white transition-colors rounded hover:bg-[#14181c]"
    >
      {children}
    </Link>
  );
}
