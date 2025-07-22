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
  MoreHorizontal, 
  Eye,
  FileText,
  Calendar,
  Building,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Mail
} from 'lucide-react';

const ApplicationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const applications = [
    {
      id: 1,
      studentName: 'Sarah Johnson',
      studentEmail: 'sarah.johnson@email.com',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'Software Engineering Intern',
      company: 'Google Inc.',
      appliedDate: '2024-01-18',
      status: 'under_review',
      stage: 'resume_review',
      matchScore: 92,
      resumeUrl: '/resume-sarah.pdf',
      coverLetter: 'I am excited to apply for this position...',
      skills: ['Python', 'React', 'Node.js'],
      gpa: 3.8,
      university: 'Columbia University'
    },
    {
      id: 2,
      studentName: 'Michael Chen',
      studentEmail: 'michael.chen@email.com',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'Data Science Intern',
      company: 'Meta',
      appliedDate: '2024-01-19',
      status: 'interviewed',
      stage: 'final_interview',
      matchScore: 88,
      resumeUrl: '/resume-michael.pdf',
      coverLetter: 'My passion for data science drives me to...',
      skills: ['Python', 'Machine Learning', 'SQL'],
      gpa: 3.9,
      university: 'Stanford University'
    },
    {
      id: 3,
      studentName: 'Emma Davis',
      studentEmail: 'emma.davis@email.com',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'UX Design Intern',
      company: 'Apple',
      appliedDate: '2024-01-20',
      status: 'accepted',
      stage: 'offer_accepted',
      matchScore: 95,
      resumeUrl: '/resume-emma.pdf',
      coverLetter: 'Design has always been my passion...',
      skills: ['Figma', 'User Research', 'Prototyping'],
      gpa: 3.7,
      university: 'MIT'
    },
    {
      id: 4,
      studentName: 'David Wilson',
      studentEmail: 'david.wilson@email.com',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'Marketing Intern',
      company: 'Netflix',
      appliedDate: '2024-01-21',
      status: 'rejected',
      stage: 'application_rejected',
      matchScore: 65,
      resumeUrl: '/resume-david.pdf',
      coverLetter: 'I believe my marketing experience...',
      skills: ['Marketing', 'Analytics', 'Content'],
      gpa: 3.5,
      university: 'UCLA'
    },
    {
      id: 5,
      studentName: 'Lisa Anderson',
      studentEmail: 'lisa.anderson@email.com',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'Product Management Intern',
      company: 'Microsoft',
      appliedDate: '2024-01-17',
      status: 'pending',
      stage: 'application_submitted',
      matchScore: 78,
      resumeUrl: '/resume-lisa.pdf',
      coverLetter: 'Product management combines my interests...',
      skills: ['Strategy', 'Analytics', 'Leadership'],
      gpa: 3.6,
      university: 'UC Berkeley'
    }
  ];

  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || application.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const applicationStats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    under_review: applications.filter(a => a.status === 'under_review').length,
    interviewed: applications.filter(a => a.status === 'interviewed').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'under_review': return 'bg-blue-100 text-blue-700';
      case 'interviewed': return 'bg-purple-100 text-purple-700';
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'under_review': return <Eye className="w-3 h-3" />;
      case 'interviewed': return <User className="w-3 h-3" />;
      case 'accepted': return <CheckCircle className="w-3 h-3" />;
      case 'rejected': return <XCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application Management</h1>
          <p className="text-sm text-gray-600">Track and manage internship applications</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{applicationStats.total}</p>
              <p className="text-sm text-gray-600">Total Applications</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{applicationStats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{applicationStats.under_review}</p>
              <p className="text-sm text-gray-600">Under Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{applicationStats.interviewed}</p>
              <p className="text-sm text-gray-600">Interviewed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{applicationStats.accepted}</p>
              <p className="text-sm text-gray-600">Accepted</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{applicationStats.rejected}</p>
              <p className="text-sm text-gray-600">Rejected</p>
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
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
                <TabsList>
                  <TabsTrigger value="all">All Applications</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="under_review">Under Review</TabsTrigger>
                  <TabsTrigger value="interviewed">Interviewed</TabsTrigger>
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
            {filteredApplications.map((application) => (
              <div key={application.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={application.studentAvatar} alt={application.studentName} />
                      <AvatarFallback>
                        {application.studentName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{application.studentName}</h3>
                        <Badge className={getStatusColor(application.status)}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1 capitalize">{application.status.replace('_', ' ')}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Match: {application.matchScore}%
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                        <span className="font-medium">{application.internshipTitle}</span>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {application.company}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Applied {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                        <span>{application.university}</span>
                        <span>GPA: {application.gpa}</span>
                        <span>{application.studentEmail}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm font-medium text-gray-900">Skills:</span>
                        {application.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-700 font-medium mb-1">Cover Letter:</p>
                        <p className="text-sm text-gray-600">{application.coverLetter}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Resume
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm">
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

export default ApplicationsPage;