export type TabId = 'journey' | 'discoveries' | 'home' | 'rewards' | 'mastery';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'journey', label: 'Journey', icon: '🗺️' },
  { id: 'discoveries', label: 'Discoveries', icon: '📖' },
  { id: 'home', label: 'Home', icon: '🏰' },
  { id: 'rewards', label: 'Rewards', icon: '🎒' },
  { id: 'mastery', label: 'Mastery', icon: '🏅' },
];

export default function TabBar({ active, onSelect }: { active: TabId; onSelect: (tab: TabId, label: string) => void }) {
  return (
    <nav
      aria-label="Main"
      className="relative z-20 grid grid-cols-5 border-t-2 border-violet-400/40 bg-gradient-to-b from-indigo-950 to-[#1a0a38] px-1.5 pb-3 pt-1.5"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id, tab.label)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 transition ${
              isActive
                ? '-mt-3 border-2 border-violet-300/80 bg-gradient-to-b from-violet-600/70 to-indigo-900 pt-2.5 shadow-[0_0_14px_rgba(167,139,250,0.7)]'
                : 'opacity-85 active:scale-95'
            }`}
          >
            <span aria-hidden className={`text-2xl ${isActive ? '' : 'grayscale-[0.25]'}`}>{tab.icon}</span>
            <span className="text-[8.5px] font-extrabold uppercase tracking-wide text-white">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}