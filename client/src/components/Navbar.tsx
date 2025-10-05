import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Bell, LogIn, LogOut, Moon, Search, Sun, User } from 'lucide-react';

export function Navbar() {
  const { user, signInWithGoogle, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [currentTime] = useState(() => {
    return new Date().toLocaleString('en-GB', { 
      timeZone: 'GMT',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  });

  return (
    <nav className="sticky top-0 z-50 border-b bg-card">
      <div className="flex items-center justify-between h-16 px-4 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <svg viewBox="0 0 40 40" className="w-full h-full">
                <circle cx="20" cy="20" r="18" fill="hsl(var(--primary))" opacity="0.2" />
                <circle cx="20" cy="12" r="6" fill="hsl(var(--primary))" />
                <path d="M20 18 L20 28" stroke="hsl(var(--primary))" strokeWidth="2" />
                <ellipse cx="20" cy="30" rx="10" ry="4" fill="hsl(var(--destructive))" opacity="0.6" />
                <circle cx="20" cy="12" r="3" fill="hsl(var(--primary-foreground))" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-display font-bold text-foreground leading-tight" data-testid="text-app-title">MineSentry</h1>
              <p className="text-[10px] text-muted-foreground font-medium tracking-wide" data-testid="text-app-slogan">GUARDING EARTH'S ECOSYSTEMS</p>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search hotspots..."
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden md:block" data-testid="text-current-time">
            {currentTime} GMT
          </span>

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {user ? (
            <>
              <Button size="icon" variant="ghost" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" data-testid="button-user-menu">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || ''} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <span className="text-sm font-medium" data-testid="text-username">{user.displayName}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} data-testid="button-logout">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={signInWithGoogle} size="sm" data-testid="button-login">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
