'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Edit, 
  Building, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  MoreHorizontal
} from 'lucide-react';

const InternshipDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [internship] = useState({
    id: params.id,
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
    startDate: '2024-03-01',
    endDate: '2024-06-01',
    description: 'Join our team to work on cutting-edge technology and build scalable systems that impact billions of users worldwide.',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      'Proficiency in Python, Java, or C++',
      'Experience with web development frameworks',
      'Strong problem-solving skills',
      'Excellent communication abilities'
    ],
    responsibilities: [
      'Develop and maintain software applications',
      'Collaborate with cross-functional teams',
      'Participate in code reviews and testing',
      'Contribute to technical documentation',
      'Learn and apply new technologies'
    ],
    benefits: [
      'Competitive salary and benefits',
      'Mentorship from senior engineers',
      'Access to cutting-edge technology',
      'Networking opportunities',
      'Potential for full-time offer'
    ],
    skills: ['Python', 'React', 'Node.js', 'SQL', 'Git'],
    remote: false
  });

  const applications = [
    {
      id: 1,
      studentName: 'Sarah Johnson',
      studentEmail: 'sarah.johnson@email.com',
      appliedDate: '2024-01-18',
      status: 'under_review',
      matchScore: 92,
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: 2,
      studentName: 'Michael Chen',
      studentEmail: 'michael.chen@email.com',
      appliedDate: '2024-01-19',
      status: 'interviewed',
      matchScore: 88,
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: 3,
      studentName: 'Emma Davis',
      studentEmail: 'emma.davis@email.com',
      appliedDate: '2024-01-20',
      status: 'accepted',
      matchScore: 95,
      avatar: '/placeholder-avatar.jpg'
    }
  ];

  const handleApprove = () => {
    toast.success('Internship approved successfully!', {
      description: 'The internship is now live and visible to students.'
    });
  };

  const handleReject = () => {
    toast.error('Internship rejected', {
      description: 'The internship has been rejected and will not be published.'
    });
  };

  const handleEdit = () => {
    router.push(`/dashboard/internships/${params.id}/edit`);
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
            <h1 className="text-2xl font-bold text-foreground">Internship Details</h1>
            <p className="text-sm text-muted-foreground">View and manage internship posting</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          {internship.status === 'pending' && (
            <>
              <Button onClick={handleApprove}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              <Button variant="destructive" onClick={handleReject}>
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          <Button variant="outline">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{internship.title}</CardTitle>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
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
                </div>
              </div>
              <Badge variant={internship.status === 'active' ? 'default' : 'secondary'}>
                {internship.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground">{internship.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
                  <ul className="space-y-2">
                    {internship.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Benefits</h3>
                  <ul className="space-y-2">
                    {internship.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {internship.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {internship.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="applications" className="space-y-4">
                <h3 className="text-lg font-semibold">Applications ({applications.length})</h3>
                {applications.map((application) => (
                  <div key={application.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={application.avatar} alt={application.studentName} />
                          <AvatarFallback>
                            {application.studentName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{application.studentName}</h4>
                          <p className="text-sm text-muted-foreground">{application.studentEmail}</p>
                          <p className="text-xs text-muted-foreground">
                            Applied on {new Date(application.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          Match: {application.matchScore}%
                        </Badge>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status.replace('_', ' ')}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-foreground">{internship.applications}</p>
                      <p className="text-sm text-muted-foreground">Total Applications</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">8</p>
                      <p className="text-sm text-muted-foreground">Interviews Scheduled</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">3</p>
                      <p className="text-sm text-muted-foreground">Offers Extended</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <Card>
          <CardHeader>
            <CardTitle>Posting Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Posted</p>
                  <p className="text-muted-foreground">{new Date(internship.posted).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Application Deadline</p>
                  <p className="text-muted-foreground">{new Date(internship.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Start Date</p>
                  <p className="text-muted-foreground">{new Date(internship.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">End Date</p>
                  <p className="text-muted-foreground">{new Date(internship.endDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Applications</p>
                  <p className="text-muted-foreground">{internship.applications} received</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Download Applications
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Applicants
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Posting
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InternshipDetailPage;