"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { UserApiService } from '@/services/userApi';

import { toast } from 'sonner';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Building,
  Shield,
  Loader2
} from 'lucide-react';
import {Admin, Intern, Supervisor} from "@/types/user";

type User = Intern | Supervisor | Admin;

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [toggleLoading, setToggleLoading] = useState<number | null>(null);
  const router = useRouter();

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await UserApiService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = (users ?? []).filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || user.role === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const userStats = {
    total: users.length,
    interns: users.filter(u => u.role === 'intern').length,
    supervisors: users.filter(u => u.role === 'supervisor').length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length
  };

  const handleCreateUser = () => {
    router.push('/dashboard/users/create');
  };

  const handleEditUser = (userId: number) => {
    router.push(`/dashboard/users/${userId}/edit`);
  };

  const handleViewUser = (userId: number) => {
    router.push(`/dashboard/users/${userId}`);
  };

  const handleToggleStatus = async (user: User) => {
    try {
      setToggleLoading(user.user_id);
      const result = await UserApiService.toggleUserStatus(user.user_id);

      // Update the user in the local state
      setUsers(prevUsers =>
          prevUsers.map(u =>
              u.user_id === user.user_id
                  ? { ...u, status: result.status as 'active' | 'inactive' }
                  : u
          )
      );

      toast.success(`User ${result.status}`, {
        description: `${user.name} has been ${result.status === 'active' ? 'activated' : 'deactivated'}.`
      });
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setToggleLoading(null);
    }
  };

  if (loading) {
    return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading users...</span>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-600">Manage interns, supervisors, and administrators</p>
          </div>
          <Button onClick={handleCreateUser}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{userStats.interns}</p>
                <p className="text-sm text-gray-600">Interns</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{userStats.supervisors}</p>
                <p className="text-sm text-gray-600">Supervisors</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{userStats.admins}</p>
                <p className="text-sm text-gray-600">Admins</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{userStats.active}</p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{userStats.inactive}</p>
                <p className="text-sm text-gray-600">Inactive</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                  />
                </div>
                <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
                  <TabsList>
                    <TabsTrigger value="all">All Users</TabsTrigger>
                    <TabsTrigger value="intern">Interns</TabsTrigger>
                    <TabsTrigger value="supervisor">Supervisors</TabsTrigger>
                    <TabsTrigger value="admin">Admins</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[calc(100vh-20rem)] overflow-y-auto">
              {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <Badge variant={
                            user.role === 'admin' ? 'default' :
                                user.role === 'supervisor' ? 'secondary' :
                                    'outline'
                          }>
                            {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                            {user.role === 'supervisor' && <Building className="w-3 h-3 mr-1" />}
                            {user.role === 'intern' && <GraduationCap className="w-3 h-3 mr-1" />}
                            {user.role}
                          </Badge>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {user.email}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {user.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Joined {new Date(user.joinDate).toLocaleDateString()}
                          </div>
                        </div>
                        {user.role === 'intern' && (
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span>{(user as Intern).institution}</span>
                              <span>•</span>
                              <span>{(user as Intern).matricNumber}</span>
                              <span>•</span>
                              <span>{(user as Intern).specialty}</span>
                            </div>
                        )}
                        {user.role === 'supervisor' && (
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span>{(user as Supervisor).department}</span>
                              <span>•</span>
                              <span>{(user as Supervisor).specialty}</span>
                              {(user as Supervisor).internCount !== undefined && (
                                  <>
                                    <span>•</span>
                                    <span>{(user as Supervisor).internCount} interns</span>
                                  </>
                              )}
                            </div>
                        )}
                        {user.role === 'admin' && (
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span>{(user as Admin).department}</span>
                            </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewUser(user.user_id)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditUser(user.user_id)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(user)}
                          disabled={toggleLoading === user.user_id}
                      >
                        {toggleLoading === user.user_id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : user.status === 'active' ? (
                            <UserX className="w-4 h-4 mr-2" />
                        ) : (
                            <UserCheck className="w-4 h-4 mr-2" />
                        )}
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toast.info('More options coming soon!')}>
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
              ))}

              {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No users found matching your criteria.
                  </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default UsersPage;