import SidebarLinks from "./SidebarLinks";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md border-r hidden md:flex flex-col">
      <div className="px-6 py-4 border-b">
        <h1 className="text-2xl font-bold">CreatorHub</h1>
      </div>

      <SidebarLinks />
    </aside>
  );
}
