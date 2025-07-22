'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Eye,
  DollarSign,
  CreditCard,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Send,
  FileText,
  Calendar,
  User,
  Building,
  TrendingUp,
  Banknote
} from 'lucide-react';

const FeesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const router = useRouter();

  const feeRecords = [
    {
      id: 1,
      studentName: 'Sarah Johnson',
      studentEmail: 'sarah.johnson@email.com',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'Software Engineering Intern',
      company: 'Google Inc.',
      feeAmount: 2500,
      currency: 'XAF',
      dueDate: '2024-02-15',
      paidDate: '2024-02-10',
      status: 'paid',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN-001-2024',
      invoiceNumber: 'INV-001-2024',
      specialty: 'Software Development',
      semester: 'Spring 2024'
    },
    {
      id: 2,
      studentName: 'Michael Chen',
      studentEmail: 'michael.chen@email.com',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'Data Science Intern',
      company: 'Meta',
      feeAmount: 2200,
      currency: 'XAF',
      dueDate: '2024-02-20',
      paidDate: null,
      status: 'pending',
      paymentMethod: null,
      transactionId: null,
      invoiceNumber: 'INV-002-2024',
      specialty: 'Data Analytics',
      semester: 'Spring 2024'
    },
    {
      id: 3,
      studentName: 'Emma Davis',
      studentEmail: 'emma.davis@email.com',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'UX Design Intern',
      company: 'Apple',
      feeAmount: 2800,
      currency: 'XAF',
      dueDate: '2024-02-25',
      paidDate: null,
      status: 'overdue',
      paymentMethod: null,
      transactionId: null,
      invoiceNumber: 'INV-003-2024',
      specialty: 'UX Design',
      semester: 'Spring 2024'
    },
    {
      id: 4,
      studentName: 'David Wilson',
      studentEmail: 'david.wilson@email.com',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'Marketing Intern',
      company: 'Netflix',
      feeAmount: 2000,
      currency: 'XAF',
      dueDate: '2024-03-01',
      paidDate: '2024-02-28',
      status: 'paid',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN-004-2024',
      invoiceNumber: 'INV-004-2024',
      specialty: 'Digital Marketing',
      semester: 'Spring 2024'
    },
    {
      id: 5,
      studentName: 'Lisa Anderson',
      studentEmail: 'lisa.anderson@email.com',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'Product Management Intern',
      company: 'Microsoft',
      feeAmount: 2600,
      currency: 'XAF',
      dueDate: '2024-03-05',
      paidDate: null,
      status: 'partial',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN-005-2024',
      invoiceNumber: 'INV-005-2024',
      specialty: 'Business Analysis',
      semester: 'Spring 2024',
      paidAmount: 1300
    }
  ];

  const filteredRecords = feeRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || record.specialty.toLowerCase().includes(selectedFilter.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    return matchesSearch && matchesFilter && matchesStatus;
  });

  const feeStats = {
    totalRecords: feeRecords.length,
    totalRevenue: feeRecords.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.feeAmount, 0),
    pendingAmount: feeRecords.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.feeAmount, 0),
    overdueAmount: feeRecords.filter(r => r.status === 'overdue').reduce((sum, r) => sum + r.feeAmount, 0),
    paid: feeRecords.filter(r => r.status === 'paid').length,
    pending: feeRecords.filter(r => r.status === 'pending').length,
    overdue: feeRecords.filter(r => r.status === 'overdue').length,
    partial: feeRecords.filter(r => r.status === 'partial').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'overdue': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'partial': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'overdue': return <AlertCircle className="w-3 h-3" />;
      case 'partial': return <CreditCard className="w-3 h-3" />;
      default: return <DollarSign className="w-3 h-3" />;
    }
  };

  const handleCreateFee = () => {
    router.push('/dashboard/fees/create');
  };

  const handleViewFee = (feeId: number) => {
    router.push(`/dashboard/fees/${feeId}`);
  };

  const handleSendReminder = (record: any) => {
    toast.success('Payment reminder sent!', {
      description: `Reminder sent to ${record.studentName} for ${record.internshipTitle}.`
    });
  };

  const handleMarkAsPaid = (record: any) => {
    toast.success('Payment recorded!', {
      description: `Fee payment for ${record.studentName} has been marked as paid.`
    });
  };

  const formatCurrency = (amount: number, currency: string = 'XAF') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Fee Management</h1>
          <p className="text-sm text-muted-foreground">Track internship fees, payments, and financial records</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => toast.info('Export functionality coming soon!')}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={handleCreateFee}>
            <Plus className="w-4 h-4 mr-2" />
            Add Fee Record
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{feeStats.totalRecords}</p>
              <p className="text-sm text-muted-foreground">Total Records</p>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{formatCurrency(feeStats.totalRevenue)}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{feeStats.paid}</p>
              <p className="text-sm text-muted-foreground">Paid</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{feeStats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{feeStats.overdue}</p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{feeStats.partial}</p>
              <p className="text-sm text-muted-foreground">Partial</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common fee management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2" variant="outline" onClick={() => toast.info('Bulk invoice generation coming soon!')}>
              <Receipt className="w-5 h-5" />
              <span className="text-sm">Generate Invoices</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline" onClick={() => toast.info('Payment reminder system coming soon!')}>
              <Send className="w-5 h-5" />
              <span className="text-sm">Send Reminders</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline" onClick={() => toast.info('Financial reports coming soon!')}>
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm">Financial Reports</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline" onClick={() => toast.info('Payment processing coming soon!')}>
              <Banknote className="w-5 h-5" />
              <span className="text-sm">Process Payments</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search fee records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
                <TabsList>
                  <TabsTrigger value="all">All Status</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="overdue">Overdue</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by specialty" />
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
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[calc(100vh-28rem)] overflow-y-auto custom-scrollbar">
            {filteredRecords.map((record) => (
              <div key={record.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={record.studentAvatar} alt={record.studentName} />
                      <AvatarFallback>{record.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-foreground">{record.studentName}</h3>
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusIcon(record.status)}
                          <span className="ml-1 capitalize">{record.status}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {formatCurrency(record.feeAmount)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {record.internshipTitle}
                        </div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {record.company}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Due: {new Date(record.dueDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {record.invoiceNumber}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                        <span><strong>Specialty:</strong> {record.specialty}</span>
                        <span><strong>Semester:</strong> {record.semester}</span>
                        {record.paidDate && (
                          <span><strong>Paid Date:</strong> {new Date(record.paidDate).toLocaleDateString()}</span>
                        )}
                        {record.paymentMethod && (
                          <span><strong>Payment Method:</strong> {record.paymentMethod}</span>
                        )}
                      </div>

                      {record.status === 'partial' && record.paidAmount && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            Partial Payment: {formatCurrency(record.paidAmount)} of {formatCurrency(record.feeAmount)}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            Remaining: {formatCurrency(record.feeAmount - record.paidAmount)}
                          </p>
                        </div>
                      )}

                      {record.transactionId && (
                        <div className="text-xs text-muted-foreground">
                          <strong>Transaction ID:</strong> {record.transactionId}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleViewFee(record.id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    {record.status === 'pending' || record.status === 'overdue' ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleSendReminder(record)}>
                          <Send className="w-4 h-4 mr-2" />
                          Remind
                        </Button>
                        <Button variant="default" size="sm" onClick={() => handleMarkAsPaid(record)}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Paid
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => toast.info('Invoice download coming soon!')}>
                        <Receipt className="w-4 h-4 mr-2" />
                        Invoice
                      </Button>
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

export default FeesPage;