'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Eye,
  Settings
} from 'lucide-react';

const AdminsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const admins = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@internhub.com',
      role: 'super_admin',
      status: 'active',
      joinDate: '2023-01-15',
      avatar: '/placeholder-avatar.jpg',
      location: 'New York, NY',
      department: 'Platform Management',
      permissions: ['user_management', 'system_settings', 'analytics'],
      lastLogin: '2024-01-22 14:30'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@internhub.com',
      role: 'admin',
      status: 'active',
      joinDate: '2023-03-20',
      avatar: '/placeholder-avatar.jpg',
      location: 'San Francisco, CA',
      department: 'User Support',
      permissions: ['user_management', 'content_moderation'],
      lastLogin: '2024-01-22 12:15'
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.brown@internhub.com',
      role: 'moderator',
      status: 'active',
      joinDate: '2023-06-10',
      avatar: '/placeholder-avatar.jpg',
      location: 'Chicago, IL',
      department: 'Content Management',
      permissions: ['content_moderation', 'announcements'],
      lastLogin: '2024-01-22 10:45'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@internhub.com',
      role: 'admin',
      status: 'inactive',
      joinDate: '2023-08-05',
      avatar: '/placeholder-avatar.jpg',
      location: 'Austin, TX',
      department: 'Analytics',
      permissions: ['analytics', 'reporting'],
      lastLogin: '2024-01-15 16:20'
    }
  ];

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || admin.role === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const adminStats = {
    total: admins.length,
    super_admin: admins.filter(a => a.role === 'super_admin').length,
    admin: admins.filter(a => a.role === 'admin').length,
    moderator: admins.filter(a => a.role === 'moderator').length,
    active: admins.filter(a => a.status === 'active').length,
    inactive: admins.filter(a => a.status === 'inactive').length
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'admin': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'moderator': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Management</h1>
          <p className="text-sm text-muted-foreground">Manage platform administrators and their permissions</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Admin
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{adminStats.total}</p>
              <p className="text-sm text-muted-foreground">Total Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{adminStats.super_admin}</p>
              <p className="text-sm text-muted-foreground">Super Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{adminStats.admin}</p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{adminStats.moderator}</p>
              <p className="text-sm text-muted-foreground">Moderators</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{adminStats.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{adminStats.inactive}</p>
              <p className="text-sm text-muted-foreground">Inactive</p>
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search admins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
                <TabsList>
                  <TabsTrigger value="all">All Admins</TabsTrigger>
                  <TabsTrigger value="super_admin">Super Admins</TabsTrigger>
                  <TabsTrigger value="admin">Admins</TabsTrigger>
                  <TabsTrigger value="moderator">Moderators</TabsTrigger>
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
          <div className="space-y-4">
            {filteredAdmins.map((admin) => (
              <div key={admin.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={admin.avatar} alt={admin.name} />
                    <AvatarFallback>{admin.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-foreground">{admin.name}</h3>
                      <Badge className={getRoleColor(admin.role)}>
                        <Shield className="w-3 h-3 mr-1" />
                        {admin.role.replace('_', ' ')}
                      </Badge>
                      <Badge variant={admin.status === 'active' ? 'default' : 'secondary'}>
                        {admin.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {admin.email}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {admin.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Joined {new Date(admin.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span>{admin.department}</span>
                      <span>•</span>
                      <span>Last login: {new Date(admin.lastLogin).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-sm font-medium text-foreground">Permissions:</span>
                      {admin.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Permissions
                  </Button>
                  <Button variant="outline" size="sm">
                    {admin.status === 'active' ? <UserX className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
                    {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminsPage;