'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import {
  ArrowLeft, Edit, Mail, Phone, MapPin, Calendar,
  GraduationCap, Building, Shield, MessageSquare,
  MoreHorizontal, UserCheck, UserX, Loader2
} from 'lucide-react';
import { UserApiService } from '@/services/userApi';
import { User } from '@/types/user';

const UserDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = params.id;
    const fetchUser = async () => {
      try {
        const data = await UserApiService.getUserById(id);
        setUser(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);


  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'employer': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'admin': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under_review': return 'bg-yellow-100 text-yellow-700';
      case 'interviewed': return 'bg-blue-100 text-blue-700';
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading user details...</span>
            </div>
          </div>
        </div>
    );
  }
  if (error) return <div className="flex items-center justify-center h-64 text-red-500">{error}</div>;
  if (!user) return <div className="flex items-center justify-center h-64">User not found</div>;

  return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">User Profile</h1>
              <p className="text-sm text-muted-foreground">View and manage user details</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline">
              {user.status === 'active' ? <UserX className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
              {user.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
            <Button variant="outline">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <CardTitle>{user.name}</CardTitle>
              <div className="flex justify-center space-x-2 mt-2">
                <Badge className={getRoleColor(user.role)}>
                  {user.role === 'student' && <GraduationCap className="w-3 h-3 mr-1" />}
                  {user.role === 'employer' && <Building className="w-3 h-3 mr-1" />}
                  {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                  {user.role}
                </Badge>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                  {user.email}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                  {user.phone}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
                  {user.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                  Joined {new Date(user.joinDate).toLocaleDateString()}
                </div>
              </div>

              {['intern', 'supervisor'].includes(user.role) && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Academic Information</h4>
                    <div className="space-y-1 text-sm">
                      {user.role === 'intern' && (
                          <div><strong>University:</strong> {user.institution}</div>
                      )}
                      <div><strong>Specialty:</strong> {user?.specialty}</div>
                    </div>
                  </div>
              )}

              {user.bio && (
                  <div className="pt-4 border-t text-sm text-muted-foreground">
                    {user.bio}
                  </div>
              )}
            </CardContent>
          </Card>

          {/* Tabs */}
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              <Tabs defaultValue="overview" className="w-full">
                <div className="px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                </div>

                {/* Overview */}
                <TabsContent value="overview" className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{user.applications ?? 0}</p><p className="text-sm text-muted-foreground">Applications</p></CardContent></Card>
                    <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">0</p><p className="text-sm text-muted-foreground">Interviews</p></CardContent></Card>
                    <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">0</p><p className="text-sm text-muted-foreground">Offers</p></CardContent></Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {user.activities?.map((activity, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                      ))}
                      {!user.activities?.length && <p className="text-muted-foreground">No recent activity.</p>}

                    </div>
                  </div>
                </TabsContent>

                {/* Applications */}
                <TabsContent value="applications" className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Application History</h3>
                  {user.applications?.map(app => (
                      <div key={app.id} className="border rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{app.internshipTitle}</h4>
                          <p className="text-sm text-muted-foreground">{app.company}</p>
                          <p className="text-xs text-muted-foreground">Applied on {new Date(app.appliedDate).toLocaleDateString()}</p>
                        </div>
                        <Badge className={getStatusColor(app.status)}>{app.status.replace('_', ' ')}</Badge>
                      </div>
                  ))}
                  {!user.applications?.length && <p className="text-muted-foreground">No applications found.</p>}
                </TabsContent>

                {/* Activity */}
                <TabsContent value="activity" className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Activity Log</h3>
                  {user.activities?.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                  ))}
                  {!user.activities?.length && <p className="text-muted-foreground">No recent activity.</p>}

                </TabsContent>

                {/* Settings */}
                <TabsContent value="settings" className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive email updates</p>
                      </div>
                      <Badge variant={user.settings?.email_notifications ? 'secondary' : 'outline'}>
                        {user.settings?.email_notifications ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Profile Visibility</h4>
                        <p className="text-sm text-muted-foreground">Who can see your profile</p>
                      </div>
                      <Badge variant={user.settings?.profile_public ? 'secondary' : 'outline'}>
                        {user.settings?.profile_public ? 'Public' : 'Private'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Extra security for your account</p>
                      </div>
                      <Badge variant={user.settings?.two_factor_auth ? 'secondary' : 'outline'}>
                        {user.settings?.two_factor_auth ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default UserDetailPage;
