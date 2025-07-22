'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  Building,
  Star,
  Users,
  Award
} from 'lucide-react';

const SupervisorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const router = useRouter();

  const supervisors = [
    {
      id: 1,
      name: 'Dr. Michael Chen',
      email: 'michael.chen@company.com',
      status: 'active',
      joinDate: '2023-01-15',
      avatar: '/placeholder-avatar.jpg',
      location: 'San Francisco, CA',
      company: 'Google Inc.',
      department: 'Engineering',
      specialty: 'Software Development',
      experience: '8 years',
      currentInterns: 3,
      totalInterns: 15,
      rating: 4.8,
      certifications: ['Agile Certified', 'Leadership Training']
    },
    {
      id: 2,
      name: 'Dr. Emily Davis',
      email: 'emily.davis@company.com',
      status: 'active',
      joinDate: '2023-03-20',
      avatar: '/placeholder-avatar.jpg',
      location: 'New York, NY',
      company: 'Meta',
      department: 'Data Science',
      specialty: 'Data Analytics',
      experience: '6 years',
      currentInterns: 2,
      totalInterns: 12,
      rating: 4.6,
      certifications: ['Data Science Certified', 'Machine Learning Expert']
    },
    {
      id: 3,
      name: 'Dr. Sarah Wilson',
      email: 'sarah.wilson@company.com',
      status: 'active',
      joinDate: '2023-06-10',
      avatar: '/placeholder-avatar.jpg',
      location: 'Cupertino, CA',
      company: 'Apple',
      department: 'Design',
      specialty: 'UX Design',
      experience: '10 years',
      currentInterns: 4,
      totalInterns: 20,
      rating: 4.9,
      certifications: ['UX Certified', 'Design Leadership']
    },
    {
      id: 4,
      name: 'Dr. Lisa Anderson',
      email: 'lisa.anderson@company.com',
      status: 'inactive',
      joinDate: '2023-08-05',
      avatar: '/placeholder-avatar.jpg',
      location: 'Seattle, WA',
      company: 'Amazon',
      department: 'Marketing',
      specialty: 'Digital Marketing',
      experience: '5 years',
      currentInterns: 0,
      totalInterns: 8,
      rating: 4.3,
      certifications: ['Digital Marketing Certified']
    }
  ];

  const filteredSupervisors = supervisors.filter(supervisor => {
    const matchesSearch = supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supervisor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supervisor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || supervisor.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const supervisorStats = {
    total: supervisors.length,
    active: supervisors.filter(s => s.status === 'active').length,
    inactive: supervisors.filter(s => s.status === 'inactive').length,
    totalInterns: supervisors.reduce((sum, s) => sum + s.currentInterns, 0),
    avgRating: (supervisors.reduce((sum, s) => sum + s.rating, 0) / supervisors.length).toFixed(1),
    avgExperience: Math.round(supervisors.reduce((sum, s) => sum + parseInt(s.experience), 0) / supervisors.length)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleCreateSupervisor = () => {
    router.push('/dashboard/supervisors/create');
  };

  const handleViewSupervisor = (supervisorId: number) => {
    router.push(`/dashboard/supervisors/${supervisorId}`);
  };

  const handleEditSupervisor = (supervisorId: number) => {
    router.push(`/dashboard/supervisors/${supervisorId}/edit`);
  };

  const handleToggleStatus = (supervisor: any) => {
    const newStatus = supervisor.status === 'active' ? 'inactive' : 'active';
    toast.success(`Supervisor ${newStatus}`, {
      description: `${supervisor.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Supervisor Management</h1>
          <p className="text-sm text-muted-foreground">Manage supervisor profiles and intern assignments</p>
        </div>
        <Button onClick={handleCreateSupervisor}>
          <Plus className="w-4 h-4 mr-2" />
          Add Supervisor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{supervisorStats.total}</p>
              <p className="text-sm text-muted-foreground">Total Supervisors</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{supervisorStats.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{supervisorStats.inactive}</p>
              <p className="text-sm text-muted-foreground">Inactive</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{supervisorStats.totalInterns}</p>
              <p className="text-sm text-muted-foreground">Current Interns</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{supervisorStats.avgRating}</p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{supervisorStats.avgExperience}</p>
              <p className="text-sm text-muted-foreground">Avg Experience (years)</p>
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
                  placeholder="Search supervisors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
                <TabsList>
                  <TabsTrigger value="all">All Supervisors</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
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
            {filteredSupervisors.map((supervisor) => (
              <div key={supervisor.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={supervisor.avatar} alt={supervisor.name} />
                      <AvatarFallback>{supervisor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-foreground">{supervisor.name}</h3>
                        <Badge className={getStatusColor(supervisor.status)}>
                          <UserCheck className="w-3 h-3 mr-1" />
                          {supervisor.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          {supervisor.rating}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {supervisor.experience} exp
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {supervisor.email}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {supervisor.location}
                        </div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {supervisor.company}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {supervisor.currentInterns} current interns
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                        <span><strong>Department:</strong> {supervisor.department}</span>
                        <span><strong>Specialty:</strong> {supervisor.specialty}</span>
                        <span><strong>Total Interns Supervised:</strong> {supervisor.totalInterns}</span>
                        <span><strong>Joined:</strong> {new Date(supervisor.joinDate).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-foreground">Certifications:</span>
                        {supervisor.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleViewSupervisor(supervisor.id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditSupervisor(supervisor.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.info('Intern assignment coming soon!')}>
                      <Users className="w-4 h-4 mr-2" />
                      Assign Interns
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.info('More options coming soon!')}>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupervisorsPage;