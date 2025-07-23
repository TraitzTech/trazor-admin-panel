'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Building,
  UserCheck,
  Star,
  Award,
  Users,
  MessageSquare,
  MoreHorizontal,
  UserX,
  Send,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  BookOpen,
  Target,
  Globe
} from 'lucide-react';

const SupervisorDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [supervisor] = useState({
    id: params.id,
    firstName: 'Dr. Michael',
    lastName: 'Chen',
    email: 'michael.chen@google.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    avatar: '/placeholder-avatar.jpg',
    
    // Professional Information
    company: 'Google Inc.',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    experience: '8 years',
    specialty: 'Software Development',
    bio: 'Experienced software engineer with a passion for mentoring the next generation of developers. Specializes in full-stack development, cloud architecture, and agile methodologies.',
    education: 'PhD in Computer Science, Stanford University',
    
    // Status & Metrics
    status: 'active',
    joinDate: '2023-01-15',
    rating: 4.8,
    totalInterns: 15,
    currentInterns: 3,
    completedInternships: 12,
    
    // Qualifications
    certifications: ['AWS Certified Solutions Architect', 'Scrum Master Certified', 'Google Cloud Professional'],
    skills: ['Python', 'JavaScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes'],
    languages: ['English', 'Mandarin', 'Spanish'],
    
    // Preferences
    maxInterns: 4,
    availability: 'full-time',
    preferredContact: 'email',
    internshipTypes: ['Full-time', 'Remote', 'Hybrid'],
    mentorshipStyle: 'I believe in hands-on learning with regular check-ins. I provide structured guidance while encouraging independent problem-solving and creative thinking.',
    
    // Settings
    emailNotifications: true,
    profileVisibility: 'public',
    lastLogin: '2024-01-22 14:30'
  });

  const currentInterns = [
    {
      id: 1,
      name: 'Sarah Johnson',
      university: 'Columbia University',
      specialty: 'Software Development',
      startDate: '2024-01-15',
      progress: 75,
      rating: 4.5,
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: 2,
      name: 'Alex Rodriguez',
      university: 'Stanford University',
      specialty: 'Software Development',
      startDate: '2024-01-10',
      progress: 60,
      rating: 4.2,
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      university: 'MIT',
      specialty: 'Software Development',
      startDate: '2024-01-20',
      progress: 45,
      rating: 4.0,
      avatar: '/placeholder-avatar.jpg'
    }
  ];

  const recentActivity = [
    { action: 'Completed intern evaluation for Sarah Johnson', time: '2 hours ago', type: 'evaluation' },
    { action: 'Approved logbook entry from Alex Rodriguez', time: '1 day ago', type: 'approval' },
    { action: 'Sent feedback to Emma Wilson', time: '2 days ago', type: 'feedback' },
    { action: 'Updated mentorship goals', time: '3 days ago', type: 'update' },
    { action: 'Joined weekly supervisor meeting', time: '1 week ago', type: 'meeting' }
  ];

  const performanceMetrics = {
    internCompletion: 92,
    averageRating: 4.6,
    responseTime: 2.4, // hours
    mentorshipEffectiveness: 88
  };

  const handleEdit = () => {
    router.push(`/dashboard/supervisors/${params.id}/edit`);
  };

  const handleToggleStatus = () => {
    const newStatus = supervisor.status === 'active' ? 'inactive' : 'active';
    toast.success(`Supervisor ${newStatus}`, {
      description: `${supervisor.firstName} ${supervisor.lastName} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`
    });
  };

  const handleSendMessage = () => {
    toast.info('Message functionality coming soon!');
  };

  const handleAssignIntern = () => {
    toast.info('Intern assignment functionality coming soon!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
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
            <h1 className="text-2xl font-bold text-foreground">Supervisor Profile</h1>
            <p className="text-sm text-muted-foreground">View and manage supervisor details</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleSendMessage}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleToggleStatus}>
            {supervisor.status === 'active' ? <UserX className="w-4 h-4 mr-2" /> : <UserCheck className="w-4 h-4 mr-2" />}
            {supervisor.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button variant="outline">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={supervisor.avatar} alt={`${supervisor.firstName} ${supervisor.lastName}`} />
              <AvatarFallback className="text-lg">
                {supervisor.firstName[0]}{supervisor.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{supervisor.firstName} {supervisor.lastName}</CardTitle>
            <div className="flex justify-center space-x-2 mb-4">
              <Badge className={getStatusColor(supervisor.status)}>
                <UserCheck className="w-3 h-3 mr-1" />
                {supervisor.status}
              </Badge>
              <Badge variant="outline">
                <Star className="w-3 h-3 mr-1" />
                {supervisor.rating}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{supervisor.bio}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                <span className="truncate">{supervisor.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>{supervisor.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>{supervisor.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Building className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>{supervisor.company}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                <span>Joined {new Date(supervisor.joinDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-muted/50 rounded">
                  <p className="text-lg font-bold text-blue-600">{supervisor.currentInterns}</p>
                  <p className="text-xs text-muted-foreground">Current</p>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <p className="text-lg font-bold text-green-600">{supervisor.totalInterns}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <p className="text-lg font-bold text-purple-600">{supervisor.experience}</p>
                  <p className="text-xs text-muted-foreground">Experience</p>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <p className="text-lg font-bold text-yellow-600">{supervisor.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleAssignIntern} className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Assign Intern
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="interns">Interns</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Professional Information</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Position:</strong> {supervisor.position}</div>
                      <div><strong>Department:</strong> {supervisor.department}</div>
                      <div><strong>Experience:</strong> {supervisor.experience}</div>
                      <div><strong>Specialty:</strong> {supervisor.specialty}</div>
                      <div><strong>Education:</strong> {supervisor.education}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Supervision Preferences</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Max Interns:</strong> {supervisor.maxInterns}</div>
                      <div><strong>Availability:</strong> {supervisor.availability}</div>
                      <div><strong>Preferred Contact:</strong> {supervisor.preferredContact}</div>
                      <div><strong>Internship Types:</strong> {supervisor.internshipTypes.join(', ')}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Mentorship Style</h3>
                  <p className="text-muted-foreground">{supervisor.mentorshipStyle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {supervisor.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {supervisor.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {supervisor.languages.map((language, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="interns" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Current Interns ({currentInterns.length})</h3>
                    <Button onClick={handleAssignIntern}>
                      <Users className="w-4 h-4 mr-2" />
                      Assign New Intern
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {currentInterns.map((intern) => (
                      <div key={intern.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={intern.avatar} alt={intern.name} />
                              <AvatarFallback>
                                {intern.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{intern.name}</h4>
                              <p className="text-sm text-muted-foreground">{intern.university}</p>
                              <p className="text-xs text-muted-foreground">
                                Started: {new Date(intern.startDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="outline">
                                <Star className="w-3 h-3 mr-1" />
                                {intern.rating}
                              </Badge>
                              <Badge variant="outline">
                                {intern.progress}% complete
                              </Badge>
                            </div>
                            <div className="w-32">
                              {/*<Progress value={50} className="h-2" />*/}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Performance Metrics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Intern Completion Rate</span>
                        <span className="text-sm text-muted-foreground">{performanceMetrics.internCompletion}%</span>
                      </div>
                      {/*<Progress value={50} className="h-2" />*/}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Average Rating</span>
                        <span className="text-sm text-muted-foreground">{performanceMetrics.averageRating}/5.0</span>
                      </div>
                      {/*<Progress value={(50 / 5) * 100} className="h-2" />*/}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Response Time</span>
                        <span className="text-sm text-muted-foreground">{performanceMetrics.responseTime}h avg</span>
                      </div>
                      {/*<Progress value={Math.max(0, 100 - (performanceMetrics.responseTime * 10))} className="h-2" />*/}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Mentorship Effectiveness</span>
                        <span className="text-sm text-muted-foreground">{performanceMetrics.mentorshipEffectiveness}%</span>
                      </div>
                      {/*<Progress value={50} className="h-2" />*/}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">{supervisor.completedInternships}</p>
                      <p className="text-sm text-muted-foreground">Completed Internships</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">{supervisor.rating}</p>
                      <p className="text-sm text-muted-foreground">Overall Rating</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-purple-600">{supervisor.currentInterns}</p>
                      <p className="text-sm text-muted-foreground">Active Interns</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'evaluation' ? 'bg-green-500' :
                        activity.type === 'approval' ? 'bg-blue-500' :
                        activity.type === 'feedback' ? 'bg-purple-500' :
                        activity.type === 'update' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive platform notifications</p>
                      </div>
                      <Badge variant={supervisor.emailNotifications ? 'default' : 'secondary'}>
                        {supervisor.emailNotifications ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Profile Visibility</h4>
                        <p className="text-sm text-muted-foreground">Who can see your profile</p>
                      </div>
                      <Badge variant="secondary">
                        {supervisor.profileVisibility}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Last Login</h4>
                        <p className="text-sm text-muted-foreground">Most recent platform access</p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(supervisor.lastLogin).toLocaleString()}
                      </span>
                    </div>
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

export default SupervisorDetailPage;