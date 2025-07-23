'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Calendar, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock,
  UserCheck,
  Building,
  GraduationCap
} from 'lucide-react';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const metrics = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Internships',
      value: '156',
      change: '+8%',
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Applications',
      value: '1,234',
      change: '+24%',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Successful Matches',
      value: '89',
      change: '+15%',
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  const recentActivity = [
    { type: 'application', user: 'Sarah Johnson', action: 'applied to Software Engineering Internship', time: '5 minutes ago' },
    { type: 'approval', user: 'Tech Corp', action: 'approved internship posting', time: '12 minutes ago' },
    { type: 'match', user: 'Mike Chen', action: 'matched with Data Science position', time: '1 hour ago' },
    { type: 'registration', user: 'Emma Davis', action: 'registered as new student', time: '2 hours ago' },
    { type: 'message', user: 'HR Manager', action: 'sent message to candidate', time: '3 hours ago' }
  ];

  const pendingItems = [
    { id: 1, type: 'Internship Approval', company: 'Google Inc.', title: 'Software Engineering Intern', status: 'pending' },
    { id: 2, type: 'User Verification', company: 'Meta', title: 'Account Verification', status: 'pending' },
    { id: 3, type: 'Application Review', company: 'Amazon', title: 'UX Design Intern', status: 'urgent' },
    { id: 4, type: 'Content Review', company: 'Microsoft', title: 'Company Profile Update', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back! Here's what's happening with your platform.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last 7 days
            </Button>
            <Button size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    <p className="text-sm text-green-600">{metric.change} from last week</p>
                  </div>
                  <div className={`p-3 rounded-full ${metric.bgColor}`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your platform efficiently</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col space-y-2" variant="outline">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">Manage Users</span>
                  </Button>
                  <Button className="h-20 flex-col space-y-2" variant="outline">
                    <Briefcase className="w-5 h-5" />
                    <span className="text-sm">Internships</span>
                  </Button>
                  <Button className="h-20 flex-col space-y-2" variant="outline">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm">Applications</span>
                  </Button>
                  <Button className="h-20 flex-col space-y-2" variant="outline">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm">Messages</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pending Items */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Items</CardTitle>
                <CardDescription>Items that require your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'urgent' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                        <div>
                          <p className="font-medium">{item.type}</p>
                          <p className="text-sm text-gray-600">{item.company} • {item.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={item.status === 'urgent' ? 'destructive' : 'secondary'}>
                          {item.status}
                        </Badge>
                        <Button size="sm" variant="outline">Review</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="internships">Internships</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Application Success Rate</p>
                        {/*<Progress value={72} className="w-full" />*/}
                        <p className="text-xs text-gray-600">72% of applications result in interviews</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Platform Engagement</p>
                        {/*<Progress value={85} className="w-full" />*/}
                        <p className="text-xs text-gray-600">85% weekly active users</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="users">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center">
                          <GraduationCap className="w-8 h-8 text-blue-600" />
                        </div>
                        <p className="text-2xl font-bold">1,842</p>
                        <p className="text-sm text-gray-600">Students</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center">
                          <Building className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold">247</p>
                        <p className="text-sm text-gray-600">Companies</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center">
                          <UserCheck className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold">89</p>
                        <p className="text-sm text-gray-600">Matches</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="internships">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Active Postings</p>
                          <p className="text-2xl font-bold">156</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Avg. Applications per Posting</p>
                          <p className="text-2xl font-bold">8.2</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'application' ? 'bg-blue-500' :
                        activity.type === 'approval' ? 'bg-green-500' :
                        activity.type === 'match' ? 'bg-purple-500' :
                        activity.type === 'registration' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.user}</p>
                        <p className="text-xs text-gray-600">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>Platform health overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">API Status</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-50 text-green-700">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Database</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-50 text-green-700">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">Email Service</span>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-50 text-yellow-700">Degraded</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">File Storage</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-50 text-green-700">Operational</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;