import React from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import { Domain } from '../store/domainsSlice';

interface SidebarProps {
  onSelectDomain: (domainId: number) => void;
  selectedDomainId: number | null;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectDomain, selectedDomainId }) => {
  const { domains } = useAppSelector((state) => state.domains);

  return (
    <aside className="w-64 border-r border-border h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Domains</h3>
          </div>
          <ul className="space-y-1">
            {domains.map((domain: Domain) => (
              <li key={domain.id}>
                <button
                  className={`flex items-center space-x-2 w-full p-2 rounded-md text-left ${
                    selectedDomainId === domain.id
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => onSelectDomain(domain.id)}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>{domain.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;