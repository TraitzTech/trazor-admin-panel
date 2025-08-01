'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
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
  GraduationCap,
  ClipboardList,
  BookOpen,
  Activity
} from 'lucide-react';
import {useRouter} from "next/navigation";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter()

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/admin/dashboard?period=${selectedPeriod}`);
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data', {
        description: error.message,
      });
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const getActivityIcon = (type) => {
    const iconMap = {
      'registration': Users,
      'task_assigned': ClipboardList,
      'logbook_submitted': BookOpen,
      'user_activity': Activity,
      'application': FileText,
      'approval': CheckCircle,
      'match': UserCheck,
      'message': MessageSquare
    };
    return iconMap[type] || Activity;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      'registration': 'bg-blue-500',
      'task_assigned': 'bg-green-500',
      'logbook_submitted': 'bg-purple-500',
      'user_activity': 'bg-yellow-500',
      'application': 'bg-blue-500',
      'approval': 'bg-green-500',
      'match': 'bg-purple-500',
      'message': 'bg-gray-500'
    };
    return colorMap[type] || 'bg-gray-500';
  };

  if (loading) {
    return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading dashboard...</span>
          </div>
        </div>
    );
  }

  if (!dashboardData) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
            <p className="text-muted-foreground">Failed to load dashboard data</p>
            <Button onClick={fetchDashboardData} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
    );
  }

  const { metrics, recent_activities, pending_items, system_stats, task_overview, logbook_stats, specialty_stats } = dashboardData;

  const metricsData = [
    {
      title: 'Total Users',
      value: metrics.total_users.value.toLocaleString(),
      change: metrics.total_users.change,
      trend: metrics.total_users.trend,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Internships',
      value: metrics.active_internships.value.toLocaleString(),
      change: metrics.active_internships.change,
      trend: metrics.active_internships.trend,
      icon: Briefcase,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Applications',
      value: metrics.total_applications.value.toLocaleString(),
      change: metrics.total_applications.change,
      trend: metrics.total_applications.trend,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Successful Matches',
      value: metrics.successful_matches.value.toLocaleString(),
      change: metrics.successful_matches.change,
      trend: metrics.successful_matches.trend,
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">
                Welcome back! Here's what's happening with your platform.
                <span className="ml-2 text-xs text-gray-500">
                Last updated: {new Date(dashboardData.last_updated).toLocaleString()}
              </span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <Button size="sm" onClick={fetchDashboardData}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData.map((metric, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        <p className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change} from last period
                        </p>
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
                    <Button className="h-20 flex-col space-y-2" variant="outline" onClick={() => router.push('/dashboard/users')}>
                      <Users className="w-5 h-5" />
                      <span className="text-sm">Manage Users</span>
                    </Button>
                    <Button className="h-20 flex-col space-y-2" variant="outline">
                      <Briefcase className="w-5 h-5" />
                      <span className="text-sm">Internships</span>
                    </Button>
                    <Button className="h-20 flex-col space-y-2" variant="outline" onClick={() => router.push('/dashboard/logbooks')}>
                      <BookOpen className="w-5 h-5" />
                      <span className="text-sm">Logbooks</span>
                    </Button>
                    <Button className="h-20 flex-col space-y-2" variant="outline" onClick={() => router.push('/dashboard/tasks')}>
                      <ClipboardList className="w-5 h-5" />
                      <span className="text-sm">Tasks</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Pending Items ({pending_items.length})</CardTitle>
                  <CardDescription>Items that require your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pending_items.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                          <p>All caught up! No pending items.</p>
                        </div>
                    ) : (
                        pending_items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className={`w-2 h-2 rounded-full ${
                                    item.priority === 'urgent' ? 'bg-red-500' : 'bg-yellow-500'
                                }`} />
                                <div>
                                  <p className="font-medium">{item.type}</p>
                                  <p className="text-sm text-gray-600">{item.user} • {item.title}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2" onClick={() => {
                                router.push(`/dashboard/logbooks/${item.id}`);
                              }}>
                                <Badge variant={item.priority === 'urgent' ? 'destructive' : 'secondary'}>
                                  {item.status}
                                </Badge>
                                <Button size="sm" variant="outline">Review</Button>
                              </div>
                            </div>
                        ))
                    )}
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
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="tasks">Tasks</TabsTrigger>
                      <TabsTrigger value="logbooks">Logbooks</TabsTrigger>
                      <TabsTrigger value="specialties">Specialties</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Task Completion Rate</p>
                          <Progress value={task_overview.completion_rate} className="w-full" />
                          <p className="text-xs text-gray-600">{task_overview.completion_rate}% of tasks completed</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Active Interns</p>
                          <Progress value={(system_stats.active_interns / system_stats.total_interns) * 100} className="w-full" />
                          <p className="text-xs text-gray-600">{system_stats.active_interns} of {system_stats.total_interns} interns active</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="tasks" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Total Tasks</p>
                          <p className="text-2xl font-bold">{task_overview.total_tasks}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Completed</p>
                          <p className="text-2xl font-bold text-green-600">{task_overview.completed_tasks}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">In Progress</p>
                          <p className="text-2xl font-bold text-blue-600">{task_overview.in_progress_tasks}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Overdue</p>
                          <p className="text-2xl font-bold text-red-600">{task_overview.overdue_tasks}</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="logbooks" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Total Logbooks</p>
                          <p className="text-2xl font-bold">{logbook_stats.total_logbooks}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Pending Review</p>
                          <p className="text-2xl font-bold text-yellow-600">{logbook_stats.pending_review}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">This Week</p>
                          <p className="text-2xl font-bold text-blue-600">{logbook_stats.this_week_submissions}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Avg Hours/Day</p>
                          <p className="text-2xl font-bold text-purple-600">{logbook_stats.average_hours_worked}h</p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="specialties" className="space-y-4">
                      <div className="space-y-3">
                        {specialty_stats.map((specialty) => (
                            <div key={specialty.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{specialty.name}</p>
                                <p className="text-sm text-gray-600">
                                  {specialty.active_interns} active • {specialty.total_supervisors} supervisors
                                </p>
                              </div>
                              <Badge variant={specialty.status === 'active' ? 'default' : 'secondary'}>
                                {specialty.status}
                              </Badge>
                            </div>
                        ))}
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
                    {recent_activities.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          <Activity className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">No recent activity</p>
                        </div>
                    ) : (
                        recent_activities.map((activity, index) => {
                          const IconComponent = getActivityIcon(activity.type);
                          return (
                              <div key={index} className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`} />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <IconComponent className="w-4 h-4 text-gray-600" />
                                    <p className="text-sm font-medium">{activity.user}</p>
                                  </div>
                                  <p className="text-xs text-gray-600">{activity.action}</p>
                                  <p className="text-xs text-gray-500">{activity.time}</p>
                                </div>
                              </div>
                          );
                        })
                    )}
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
                      <Badge className="bg-green-50 text-green-700">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Database</span>
                      </div>
                      <Badge className="bg-green-50 text-green-700">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Email Service</span>
                      </div>
                      <Badge className="bg-yellow-50 text-yellow-700">Degraded</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">File Storage</span>
                      </div>
                      <Badge className="bg-green-50 text-green-700">Operational</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>At a glance numbers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Total Specialties</span>
                      </div>
                      <span className="font-semibold">{system_stats.total_specialties}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <UserCheck className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Total Supervisors</span>
                      </div>
                      <span className="font-semibold">{system_stats.total_supervisors}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Total Interns</span>
                      </div>
                      <span className="font-semibold">{system_stats.total_interns}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm">Completed Internships</span>
                      </div>
                      <span className="font-semibold">{system_stats.completed_internships}</span>
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