import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UserCheck, 
  Clock,
  FileText,
  Settings,
  HelpCircle
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Queue Management', href: '/queue', icon: Clock },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Doctors', href: '/doctors', icon: UserCheck },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Reports', href: '/reports', icon: FileText },
];

const secondaryNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-card border-r border-border shadow-card-medical">
      <nav className="p-4 space-y-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-primary text-primary-foreground shadow-medical"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="pt-4 mt-6 border-t border-border">
          <div className="space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-medical"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}