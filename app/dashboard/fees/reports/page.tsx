'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Download, 
  FileText, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Building,
  ArrowLeft,
  Filter,
  RefreshCw,
  Mail,
  Printer,
  Share
} from 'lucide-react';

const FinancialReportsPage = () => {
  const router = useRouter();
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-03-31');
  const [specialty, setSpecialty] = useState('all');
  const [status, setStatus] = useState('all');

  const reportData = {
    summary: {
      totalRevenue: 12600000, // Total in XAF
      paidAmount: 8400000,
      pendingAmount: 2100000,
      overdueAmount: 2100000,
      totalStudents: 25,
      paidStudents: 14,
      pendingStudents: 6,
      overdueStudents: 5,
      averageFee: 1680000,
      collectionRate: 66.7
    },
    bySpecialty: [
      { specialty: 'Software Development', revenue: 5040000, students: 10, avgFee: 1680000 },
      { specialty: 'Data Analytics', revenue: 3360000, students: 8, avgFee: 1400000 },
      { specialty: 'UX Design', revenue: 2520000, students: 5, avgFee: 1680000 },
      { specialty: 'Digital Marketing', revenue: 1680000, students: 2, avgFee: 1400000 }
    ],
    byMonth: [
      { month: 'January', revenue: 4200000, payments: 5 },
      { month: 'February', revenue: 2520000, payments: 3 },
      { month: 'March', revenue: 1680000, payments: 6 }
    ],
    byCompany: [
      { company: 'Google Inc.', revenue: 3360000, students: 4 },
      { company: 'Meta', revenue: 2520000, students: 3 },
      { company: 'Apple', revenue: 1680000, students: 2 },
      { company: 'Microsoft', revenue: 1680000, students: 2 },
      { company: 'Netflix', revenue: 1400000, students: 1 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleGenerateReport = () => {
    toast.success('Report generated successfully!', {
      description: `${reportType} report for ${dateRange} period is ready for download.`
    });
  };

  const handleDownloadReport = (format: string) => {
    toast.success(`Report download started`, {
      description: `Downloading ${reportType} report in ${format.toUpperCase()} format.`
    });
  };

  const handleEmailReport = () => {
    toast.success('Report emailed!', {
      description: 'The report has been sent to your email address.'
    });
  };

  const handleScheduleReport = () => {
    toast.info('Report scheduling coming soon!', {
      description: 'Automated report scheduling will be available soon.'
    });
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
            <h1 className="text-2xl font-bold text-foreground">Financial Reports</h1>
            <p className="text-sm text-muted-foreground">Generate comprehensive financial reports and analytics</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => toast.info('Report templates coming soon!')}>
            <FileText className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button variant="outline" onClick={handleScheduleReport}>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Reports
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Report Configuration
            </CardTitle>
            <CardDescription>Configure your financial report parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Financial Summary</SelectItem>
                  <SelectItem value="detailed">Detailed Transactions</SelectItem>
                  <SelectItem value="specialty">By Specialty</SelectItem>
                  <SelectItem value="company">By Company</SelectItem>
                  <SelectItem value="student">Student Report</SelectItem>
                  <SelectItem value="overdue">Overdue Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Specialty Filter</Label>
              <Select value={specialty} onValueChange={setSpecialty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Specialties</SelectItem>
                  <SelectItem value="software">Software Development</SelectItem>
                  <SelectItem value="data">Data Analytics</SelectItem>
                  <SelectItem value="design">UX Design</SelectItem>
                  <SelectItem value="marketing">Digital Marketing</SelectItem>
                  <SelectItem value="business">Business Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid Only</SelectItem>
                  <SelectItem value="pending">Pending Only</SelectItem>
                  <SelectItem value="overdue">Overdue Only</SelectItem>
                  <SelectItem value="partial">Partial Payments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleGenerateReport} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Report
            </Button>

            <div className="pt-4 border-t">
              <Label className="text-sm font-medium">Export Options</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => handleDownloadReport('pdf')}>
                  <FileText className="w-4 h-4 mr-1" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownloadReport('excel')}>
                  <Download className="w-4 h-4 mr-1" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownloadReport('csv')}>
                  <Download className="w-4 h-4 mr-1" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={handleEmailReport}>
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Content */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Financial Report - {reportType.charAt(0).toUpperCase() + reportType.slice(1)}
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleDownloadReport('pdf')}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.info('Print functionality coming soon!')}>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.info('Share functionality coming soon!')}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Report generated for {dateRange} period • Last updated: {new Date().toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.summary.totalRevenue)}</p>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(reportData.summary.paidAmount)}</p>
                      <p className="text-sm text-muted-foreground">Collected</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-600">{formatCurrency(reportData.summary.pendingAmount)}</p>
                      <p className="text-sm text-muted-foreground">Pending</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(reportData.summary.overdueAmount)}</p>
                      <p className="text-sm text-muted-foreground">Overdue</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Collection Rate */}
                <Card>
                  <CardHeader>
                    <CardTitle>Collection Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">{reportData.summary.collectionRate}%</p>
                        <p className="text-sm text-muted-foreground">Collection Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-foreground">{reportData.summary.totalStudents}</p>
                        <p className="text-sm text-muted-foreground">Total Students</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">{formatCurrency(reportData.summary.averageFee)}</p>
                        <p className="text-sm text-muted-foreground">Average Fee</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Status Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{reportData.summary.paidStudents}</p>
                        <p className="text-sm text-green-700 dark:text-green-300">Paid Students</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">{reportData.summary.pendingStudents}</p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">Pending Students</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{reportData.summary.overdueStudents}</p>
                        <p className="text-sm text-red-700 dark:text-red-300">Overdue Students</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="breakdown" className="space-y-6">
                {/* By Specialty */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Specialty</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.bySpecialty.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{item.specialty}</p>
                            <p className="text-sm text-muted-foreground">{item.students} students</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatCurrency(item.revenue)}</p>
                            <p className="text-sm text-muted-foreground">Avg: {formatCurrency(item.avgFee)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* By Company */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Company</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.byCompany.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Building className="w-8 h-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{item.company}</p>
                              <p className="text-sm text-muted-foreground">{item.students} students</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{formatCurrency(item.revenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                {/* Monthly Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Revenue Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Revenue trend chart would go here</p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {reportData.byMonth.map((item, index) => (
                        <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="font-medium">{item.month}</p>
                          <p className="text-sm font-bold text-green-600">{formatCurrency(item.revenue)}</p>
                          <p className="text-xs text-muted-foreground">{item.payments} payments</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Collection Rate Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Collection Rate Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-muted/50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Collection rate chart would go here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Transaction List</CardTitle>
                    <CardDescription>Complete list of all transactions in the selected period</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { student: 'Sarah Johnson', amount: 1680000, date: '2024-02-10', status: 'paid', company: 'Google' },
                        { student: 'David Wilson', amount: 1200000, date: '2024-02-28', status: 'paid', company: 'Netflix' },
                        { student: 'Michael Chen', amount: 1320000, date: '2024-02-20', status: 'pending', company: 'Meta' },
                        { student: 'Emma Davis', amount: 1680000, date: '2024-02-25', status: 'overdue', company: 'Apple' },
                        { student: 'Lisa Anderson', amount: 1560000, date: '2024-03-05', status: 'partial', company: 'Microsoft' }
                      ].map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{transaction.student}</p>
                            <p className="text-sm text-muted-foreground">{transaction.company}</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold">{formatCurrency(transaction.amount)}</p>
                            <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                          </div>
                          <Badge variant={
                            transaction.status === 'paid' ? 'default' :
                            transaction.status === 'pending' ? 'secondary' :
                            transaction.status === 'overdue' ? 'destructive' :
                            'outline'
                          }>
                            {transaction.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialReportsPage;