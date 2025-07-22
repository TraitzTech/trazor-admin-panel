'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Briefcase, 
  FileText, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

const AnalyticsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const overviewMetrics = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      description: 'Active users this month'
    },
    {
      title: 'Active Internships',
      value: '156',
      change: '+8.2%',
      changeType: 'positive',
      icon: Briefcase,
      description: 'Currently posted positions'
    },
    {
      title: 'Applications Submitted',
      value: '1,234',
      change: '+24.1%',
      changeType: 'positive',
      icon: FileText,
      description: 'This month'
    },
    {
      title: 'Successful Matches',
      value: '89',
      change: '-2.3%',
      changeType: 'negative',
      icon: TrendingUp,
      description: 'Accepted applications'
    }
  ];

  const userGrowthData = [
    { month: 'Jan', students: 1200, employers: 180 },
    { month: 'Feb', students: 1380, employers: 195 },
    { month: 'Mar', students: 1520, employers: 210 },
    { month: 'Apr', students: 1680, employers: 225 },
    { month: 'May', students: 1842, employers: 247 },
  ];

  const applicationTrends = [
    { week: 'Week 1', applications: 45, matches: 8 },
    { week: 'Week 2', applications: 52, matches: 12 },
    { week: 'Week 3', applications: 38, matches: 7 },
    { week: 'Week 4', applications: 48, matches: 9 },
  ];

  const topCompanies = [
    { name: 'Google', applications: 156, matches: 28 },
    { name: 'Meta', applications: 142, matches: 25 },
    { name: 'Apple', applications: 138, matches: 22 },
    { name: 'Microsoft', applications: 134, matches: 21 },
    { name: 'Amazon', applications: 128, matches: 18 },
  ];

  const skillDemand = [
    { skill: 'Python', demand: 85, growth: '+12%' },
    { skill: 'React', demand: 78, growth: '+8%' },
    { skill: 'Data Science', demand: 72, growth: '+15%' },
    { skill: 'UX Design', demand: 68, growth: '+5%' },
    { skill: 'Machine Learning', demand: 65, growth: '+18%' },
  ];

  const universityStats = [
    { university: 'Stanford University', students: 248, applications: 382 },
    { university: 'MIT', students: 235, applications: 361 },
    { university: 'UC Berkeley', students: 198, applications: 295 },
    { university: 'Harvard University', students: 187, applications: 278 },
    { university: 'Columbia University', students: 172, applications: 256 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-600">Comprehensive platform insights and metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <TabsList>
              <TabsTrigger value="7d">7 Days</TabsTrigger>
              <TabsTrigger value="30d">30 Days</TabsTrigger>
              <TabsTrigger value="90d">90 Days</TabsTrigger>
              <TabsTrigger value="1y">1 Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-sm font-medium ${
                      metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.changeType === 'positive' ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
                      {metric.change}
                    </span>
                    <span className="text-xs text-gray-500">vs last period</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <metric.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              User Growth Trends
            </CardTitle>
            <CardDescription>Monthly user registration by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">User Growth Chart</p>
                <p className="text-xs text-gray-500">Chart visualization would go here</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">1,842</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">247</p>
                <p className="text-sm text-gray-600">Total Employers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Success Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Application Success Rate
            </CardTitle>
            <CardDescription>Breakdown of application outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Success Rate Chart</p>
                <p className="text-xs text-gray-500">Chart visualization would go here</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Accepted</span>
                <span className="text-sm font-medium">23%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Under Review</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Rejected</span>
                <span className="text-sm font-medium">32%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Companies */}
        <Card>
          <CardHeader>
            <CardTitle>Top Companies</CardTitle>
            <CardDescription>Most active employers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCompanies.map((company, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-gray-600">{company.applications} applications</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{company.matches} matches</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skill Demand */}
        <Card>
          <CardHeader>
            <CardTitle>In-Demand Skills</CardTitle>
            <CardDescription>Most requested skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillDemand.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{skill.skill}</span>
                    <span className="text-sm text-green-600">{skill.growth}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${skill.demand}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* University Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Top Universities</CardTitle>
            <CardDescription>Most active student universities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {universityStats.map((uni, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{uni.university}</p>
                    <p className="text-xs text-gray-600">{uni.students} students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{uni.applications}</p>
                    <p className="text-xs text-gray-600">applications</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Platform Activity Timeline
          </CardTitle>
          <CardDescription>Real-time platform activities and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: '2 hours ago', event: 'Peak application submissions reached', type: 'milestone' },
              { time: '4 hours ago', event: 'New company "Startup Inc." joined the platform', type: 'registration' },
              { time: '6 hours ago', event: 'Weekly application review process completed', type: 'process' },
              { time: '8 hours ago', event: '50+ new student registrations in the last 24 hours', type: 'milestone' },
              { time: '12 hours ago', event: 'System maintenance completed successfully', type: 'system' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'milestone' ? 'bg-green-500' :
                  activity.type === 'registration' ? 'bg-blue-500' :
                  activity.type === 'process' ? 'bg-purple-500' :
                  'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.event}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;