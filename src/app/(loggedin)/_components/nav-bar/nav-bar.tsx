import { MainNav } from "./_components/main-nav/main-nav";
import { Search } from "./_components/search/search";
import { UserNav } from "./_components/user-nav/user-nav";

export function NavBar() {
  return (
    <div className="flex justify-between gap-2 border-b bg-white px-10 py-4">
      <MainNav />
      <div className="flex items-center gap-2">
        <Search />
        <UserNav />
      </div>
    </div>
  );
}
