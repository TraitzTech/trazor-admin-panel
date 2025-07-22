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
  Download,
  Send,
  Receipt,
  FileText,
  Calendar,
  User,
  Building,
  ArrowLeft,
  Printer,
  Mail,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const InvoicesPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const invoices = [
    {
      id: 1,
      invoiceNumber: 'INV-001-2024',
      studentName: 'Sarah Johnson',
      studentEmail: 'sarah.johnson@email.com',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'Software Engineering Intern',
      company: 'Google Inc.',
      amount: 1680000, // 2500 USD converted to XAF
      currency: 'XAF',
      issueDate: '2024-01-15',
      dueDate: '2024-02-15',
      paidDate: '2024-02-10',
      status: 'paid',
      paymentMethod: 'Credit Card',
      transactionId: 'TXN-001-2024',
      specialty: 'Software Development',
      semester: 'Spring 2024'
    },
    {
      id: 2,
      invoiceNumber: 'INV-002-2024',
      studentName: 'Michael Chen',
      studentEmail: 'michael.chen@email.com',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'Data Science Intern',
      company: 'Meta',
      amount: 1320000, // 2200 USD converted to XAF
      currency: 'XAF',
      issueDate: '2024-01-18',
      dueDate: '2024-02-20',
      paidDate: null,
      status: 'sent',
      paymentMethod: null,
      transactionId: null,
      specialty: 'Data Analytics',
      semester: 'Spring 2024'
    },
    {
      id: 3,
      invoiceNumber: 'INV-003-2024',
      studentName: 'Emma Davis',
      studentEmail: 'emma.davis@email.com',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'UX Design Intern',
      company: 'Apple',
      amount: 1680000, // 2800 USD converted to XAF
      currency: 'XAF',
      issueDate: '2024-01-20',
      dueDate: '2024-02-25',
      paidDate: null,
      status: 'overdue',
      paymentMethod: null,
      transactionId: null,
      specialty: 'UX Design',
      semester: 'Spring 2024'
    },
    {
      id: 4,
      invoiceNumber: 'INV-004-2024',
      studentName: 'David Wilson',
      studentEmail: 'david.wilson@email.com',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'Marketing Intern',
      company: 'Netflix',
      amount: 1200000, // 2000 USD converted to XAF
      currency: 'XAF',
      issueDate: '2024-01-22',
      dueDate: '2024-03-01',
      paidDate: '2024-02-28',
      status: 'paid',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN-004-2024',
      specialty: 'Digital Marketing',
      semester: 'Spring 2024'
    },
    {
      id: 5,
      invoiceNumber: 'INV-005-2024',
      studentName: 'Lisa Anderson',
      studentEmail: 'lisa.anderson@email.com',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'Product Management Intern',
      company: 'Microsoft',
      amount: 1560000, // 2600 USD converted to XAF
      currency: 'XAF',
      issueDate: '2024-01-25',
      dueDate: '2024-03-05',
      paidDate: null,
      status: 'draft',
      paymentMethod: null,
      transactionId: null,
      specialty: 'Business Analysis',
      semester: 'Spring 2024'
    }
  ];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || invoice.specialty.toLowerCase().includes(selectedFilter.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus;
    return matchesSearch && matchesFilter && matchesStatus;
  });

  const invoiceStats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    sent: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
    paidAmount: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'sent': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'overdue': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-3 h-3" />;
      case 'sent': return <Send className="w-3 h-3" />;
      case 'overdue': return <AlertCircle className="w-3 h-3" />;
      case 'draft': return <Edit className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCreateInvoice = () => {
    toast.info('Create invoice functionality coming soon!');
  };

  const handleViewInvoice = (invoiceId: number) => {
    toast.info(`Viewing invoice ${invoiceId}`);
  };

  const handleDownloadInvoice = (invoice: any) => {
    toast.success('Invoice download started', {
      description: `Downloading ${invoice.invoiceNumber} as PDF.`
    });
  };

  const handleSendInvoice = (invoice: any) => {
    toast.success('Invoice sent!', {
      description: `${invoice.invoiceNumber} has been sent to ${invoice.studentName}.`
    });
  };

  const handleBulkAction = (action: string) => {
    toast.info(`Bulk ${action} functionality coming soon!`);
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
            <h1 className="text-2xl font-bold text-foreground">Invoice Management</h1>
            <p className="text-sm text-muted-foreground">Create, send, and manage student invoices</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => handleBulkAction('download')}>
            <Download className="w-4 h-4 mr-2" />
            Bulk Download
          </Button>
          <Button onClick={handleCreateInvoice}>
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{invoiceStats.total}</p>
              <p className="text-sm text-muted-foreground">Total Invoices</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{invoiceStats.draft}</p>
              <p className="text-sm text-muted-foreground">Draft</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{invoiceStats.sent}</p>
              <p className="text-sm text-muted-foreground">Sent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{invoiceStats.paid}</p>
              <p className="text-sm text-muted-foreground">Paid</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{invoiceStats.overdue}</p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{formatCurrency(invoiceStats.paidAmount)}</p>
              <p className="text-sm text-muted-foreground">Collected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common invoice management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2" variant="outline" onClick={() => handleBulkAction('generate')}>
              <Receipt className="w-5 h-5" />
              <span className="text-sm">Bulk Generate</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline" onClick={() => handleBulkAction('send')}>
              <Send className="w-5 h-5" />
              <span className="text-sm">Bulk Send</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline" onClick={() => handleBulkAction('reminder')}>
              <Mail className="w-5 h-5" />
              <span className="text-sm">Send Reminders</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline" onClick={() => handleBulkAction('export')}>
              <Download className="w-5 h-5" />
              <span className="text-sm">Export Report</span>
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
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
                <TabsList>
                  <TabsTrigger value="all">All Status</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="sent">Sent</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
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
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={invoice.studentAvatar} alt={invoice.studentName} />
                      <AvatarFallback>{invoice.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-foreground">{invoice.invoiceNumber}</h3>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1 capitalize">{invoice.status}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {formatCurrency(invoice.amount)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {invoice.studentName}
                        </div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {invoice.company}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Issued: {new Date(invoice.issueDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                        <span><strong>Position:</strong> {invoice.internshipTitle}</span>
                        <span><strong>Specialty:</strong> {invoice.specialty}</span>
                        <span><strong>Semester:</strong> {invoice.semester}</span>
                        <span><strong>Email:</strong> {invoice.studentEmail}</span>
                      </div>

                      {invoice.paidDate && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium text-green-700 dark:text-green-300">
                            Paid on {new Date(invoice.paidDate).toLocaleDateString()}
                          </p>
                          {invoice.paymentMethod && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                              Payment Method: {invoice.paymentMethod}
                            </p>
                          )}
                          {invoice.transactionId && (
                            <p className="text-xs text-green-600 dark:text-green-400">
                              Transaction ID: {invoice.transactionId}
                            </p>
                          )}
                        </div>
                      )}

                      {invoice.status === 'overdue' && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-3">
                          <p className="text-sm font-medium text-red-700 dark:text-red-300">
                            Overdue by {Math.ceil((new Date().getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 3600 * 24))} days
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleViewInvoice(invoice.id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(invoice)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    {invoice.status === 'draft' || invoice.status === 'overdue' ? (
                      <Button variant="default" size="sm" onClick={() => handleSendInvoice(invoice)}>
                        <Send className="w-4 h-4 mr-2" />
                        Send
                      </Button>
                    ) : invoice.status === 'sent' ? (
                      <Button variant="outline" size="sm" onClick={() => handleSendInvoice(invoice)}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => toast.info('Print functionality coming soon!')}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print
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

export default InvoicesPage;