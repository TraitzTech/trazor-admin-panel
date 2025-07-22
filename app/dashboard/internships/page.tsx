'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  CheckCircle,
  XCircle,
  Clock,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Users
} from 'lucide-react';

const InternshipsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const router = useRouter();

  const internships = [
    {
      id: 1,
      title: 'Software Engineering Intern',
      company: 'Google Inc.',
      location: 'Mountain View, CA',
      type: 'Full-time',
      salary: '$8,000/month',
      duration: '3 months',
      status: 'active',
      applications: 24,
      posted: '2024-01-15',
      deadline: '2024-02-15',
      description: 'Join our team to work on cutting-edge technology...',
      requirements: ['Computer Science', 'Python', 'React'],
      remote: false
    },
    {
      id: 2,
      title: 'Data Science Intern',
      company: 'Meta',
      location: 'Menlo Park, CA',
      type: 'Full-time',
      salary: '$7,500/month',
      duration: '4 months',
      status: 'pending',
      applications: 18,
      posted: '2024-01-18',
      deadline: '2024-02-18',
      description: 'Work with our data science team to analyze user behavior...',
      requirements: ['Statistics', 'Python', 'Machine Learning'],
      remote: true
    },
    {
      id: 3,
      title: 'UX Design Intern',
      company: 'Apple',
      location: 'Cupertino, CA',
      type: 'Part-time',
      salary: '$6,000/month',
      duration: '6 months',
      status: 'active',
      applications: 31,
      posted: '2024-01-12',
      deadline: '2024-02-12',
      description: 'Create intuitive and beautiful user experiences...',
      requirements: ['Design', 'Figma', 'User Research'],
      remote: false
    },
    {
      id: 4,
      title: 'Marketing Intern',
      company: 'Netflix',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      salary: '$5,500/month',
      duration: '3 months',
      status: 'rejected',
      applications: 12,
      posted: '2024-01-20',
      deadline: '2024-02-20',
      description: 'Support marketing campaigns and content strategy...',
      requirements: ['Marketing', 'Analytics', 'Communication'],
      remote: true
    },
    {
      id: 5,
      title: 'Product Management Intern',
      company: 'Microsoft',
      location: 'Redmond, WA',
      type: 'Full-time',
      salary: '$7,000/month',
      duration: '4 months',
      status: 'active',
      applications: 28,
      posted: '2024-01-14',
      deadline: '2024-02-14',
      description: 'Work with product teams to define and execute product strategy...',
      requirements: ['Business', 'Strategy', 'Analytics'],
      remote: false
    }
  ];

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || internship.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const internshipStats = {
    total: internships.length,
    active: internships.filter(i => i.status === 'active').length,
    pending: internships.filter(i => i.status === 'pending').length,
    rejected: internships.filter(i => i.status === 'rejected').length,
    totalApplications: internships.reduce((sum, i) => sum + i.applications, 0)
  };

  const handleCreateInternship = () => {
    router.push('/dashboard/internships/create');
  };

  const handleViewInternship = (id: number) => {
    router.push(`/dashboard/internships/${id}`);
  };

  const handleEditInternship = (id: number) => {
    router.push(`/dashboard/internships/${id}/edit`);
  };

  const handleApprove = (internship: any) => {
    toast.success('Internship approved!', {
      description: `${internship.title} at ${internship.company} has been approved and is now live.`
    });
  };

  const handleReject = (internship: any) => {
    toast.error('Internship rejected', {
      description: `${internship.title} at ${internship.company} has been rejected.`
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Internship Management</h1>
          <p className="text-sm text-gray-600">Manage and review internship postings</p>
        </div>
        <Button onClick={handleCreateInternship}>
          <Plus className="w-4 h-4 mr-2" />
          Add Internship
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{internshipStats.total}</p>
              <p className="text-sm text-gray-600">Total Postings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{internshipStats.active}</p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{internshipStats.pending}</p>
              <p className="text-sm text-gray-600">Pending Approval</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{internshipStats.rejected}</p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{internshipStats.totalApplications}</p>
              <p className="text-sm text-gray-600">Total Applications</p>
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
                  placeholder="Search internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
                <TabsList>
                  <TabsTrigger value="all">All Postings</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
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
            {filteredInternships.map((internship) => (
              <div key={internship.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
                      <Badge variant={
                        internship.status === 'active' ? 'default' :
                        internship.status === 'pending' ? 'secondary' :
                        'destructive'
                      }>
                        {internship.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {internship.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {internship.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {internship.status}
                      </Badge>
                      {internship.remote && <Badge variant="outline">Remote</Badge>}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {internship.company}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {internship.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {internship.salary}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {internship.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {internship.applications} applications
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{internship.description}</p>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">Requirements:</span>
                      {internship.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-3">
                      <span>Posted: {new Date(internship.posted).toLocaleDateString()}</span>
                      <span>Deadline: {new Date(internship.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleViewInternship(internship.id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditInternship(internship.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    {internship.status === 'pending' && (
                      <>
                        <Button variant="default" size="sm" onClick={() => handleApprove(internship)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleReject(internship)}>
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
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

export default InternshipsPage;