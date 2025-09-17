'use client';

import { useAuth } from '@/context/auth-context';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="View and manage your account details."
      />
      <Card>
        <CardHeader className="flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'User'} />
            <AvatarFallback className="text-2xl">{getInitials(user?.displayName)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-3xl font-headline">{user?.displayName ?? 'Anonymous User'}</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input id="displayName" value={user?.displayName ?? ''} disabled />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={user?.email ?? ''} disabled />
                </div>
            </div>
            <div className="flex gap-2">
                <Button disabled>Edit Profile</Button>
                 <Button variant="outline" onClick={logout}>
                    <LogOut className="mr-2" />
                    Log Out
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
