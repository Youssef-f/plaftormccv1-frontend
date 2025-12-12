import SidebarLinks from "./SidebarLinks";

export default function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r border-white/10 bg-white/5 backdrop-blur md:flex">
      <div className="border-b border-white/10 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">CreatorHub</h1>
        <p className="text-xs uppercase tracking-[0.12em] text-slate-300">
          Control center
        </p>
      </div>

      <SidebarLinks />
    </aside>
  );
}
