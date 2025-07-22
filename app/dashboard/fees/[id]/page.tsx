'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Edit, 
  DollarSign, 
  Calendar, 
  User, 
  Building,
  CheckCircle,
  AlertCircle,
  Clock,
  CreditCard,
  Receipt,
  Send,
  Download,
  MoreHorizontal,
  FileText,
  Banknote
} from 'lucide-react';

const FeeDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [paymentNote, setPaymentNote] = useState('');
  
  const [feeRecord] = useState({
    id: params.id,
    studentName: 'Sarah Johnson',
    studentEmail: 'sarah.johnson@email.com',
    studentAvatar: '/placeholder-avatar.jpg',
    studentPhone: '+1 (555) 123-4567',
    university: 'Columbia University',
    internshipTitle: 'Software Engineering Intern',
    company: 'Google Inc.',
    supervisor: 'Dr. Michael Chen',
    specialty: 'Software Development',
    semester: 'Spring 2024',
    feeAmount: 2500,
    paidAmount: 2500,
    currency: 'XAF',
    dueDate: '2024-02-15',
    paidDate: '2024-02-10',
    status: 'paid',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN-001-2024',
    invoiceNumber: 'INV-001-2024',
    description: 'Internship placement fee for Spring 2024 semester including mentorship and career guidance services.',
    createdAt: '2024-01-15 10:30',
    createdBy: 'Admin User',
    lateFeeEnabled: true,
    lateFeeAmount: 50,
    discountApplied: 0,
    paymentPlan: 'full',
    notes: 'Student requested early payment confirmation for scholarship documentation.'
  });

  const paymentHistory = [
    {
      id: 1,
      date: '2024-02-10',
      amount: 2500,
      method: 'Credit Card',
      transactionId: 'TXN-001-2024',
      status: 'completed',
      note: 'Full payment received'
    }
  ];

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
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'partial': return <CreditCard className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'XAF') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleEdit = () => {
    router.push(`/dashboard/fees/${params.id}/edit`);
  };

  const handleSendReminder = () => {
    toast.success('Payment reminder sent!', {
      description: `Reminder sent to ${feeRecord.studentName}.`
    });
  };

  const handleRecordPayment = () => {
    if (!paymentNote.trim()) {
      toast.error('Please add a payment note');
      return;
    }
    toast.success('Payment recorded!', {
      description: 'Payment has been successfully recorded.'
    });
    setPaymentNote('');
  };

  const handleDownloadInvoice = () => {
    toast.success('Invoice download started', {
      description: 'Invoice PDF is being prepared for download.'
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
            <h1 className="text-2xl font-bold text-foreground">Fee Record Details</h1>
            <p className="text-sm text-muted-foreground">View and manage fee record</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleDownloadInvoice}>
            <Download className="w-4 h-4 mr-2" />
            Download Invoice
          </Button>
          {feeRecord.status !== 'paid' && (
            <Button onClick={handleSendReminder}>
              <Send className="w-4 h-4 mr-2" />
              Send Reminder
            </Button>
          )}
          <Button variant="outline">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee Summary Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle>{formatCurrency(feeRecord.feeAmount, feeRecord.currency)}</CardTitle>
            <div className="flex justify-center space-x-2">
              <Badge className={getStatusColor(feeRecord.status)}>
                {getStatusIcon(feeRecord.status)}
                <span className="ml-2 capitalize">{feeRecord.status}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Receipt className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Invoice Number</p>
                  <p className="text-muted-foreground">{feeRecord.invoiceNumber}</p>
                </div>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Due Date</p>
                  <p className="text-muted-foreground">{new Date(feeRecord.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              {feeRecord.paidDate && (
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-3 text-green-500" />
                  <div>
                    <p className="font-medium">Paid Date</p>
                    <p className="text-muted-foreground">{new Date(feeRecord.paidDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center text-sm">
                <FileText className="w-4 h-4 mr-3 text-muted-foreground" />
                <div>
                  <p className="font-medium">Semester</p>
                  <p className="text-muted-foreground">{feeRecord.semester}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Payment Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Amount:</span>
                  <span>{formatCurrency(feeRecord.feeAmount, feeRecord.currency)}</span>
                </div>
                {feeRecord.discountApplied > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(feeRecord.discountApplied, feeRecord.currency)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(feeRecord.feeAmount - feeRecord.discountApplied, feeRecord.currency)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Amount Paid:</span>
                  <span>{formatCurrency(feeRecord.paidAmount, feeRecord.currency)}</span>
                </div>
                {feeRecord.paidAmount < feeRecord.feeAmount && (
                  <div className="flex justify-between text-red-600">
                    <span>Outstanding:</span>
                    <span>{formatCurrency(feeRecord.feeAmount - feeRecord.paidAmount, feeRecord.currency)}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <Tabs defaultValue="overview" className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="student">Student Info</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Fee Description</h3>
                  <p className="text-muted-foreground">{feeRecord.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Internship Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Position:</strong> {feeRecord.internshipTitle}</div>
                      <div><strong>Company:</strong> {feeRecord.company}</div>
                      <div><strong>Supervisor:</strong> {feeRecord.supervisor}</div>
                      <div><strong>Specialty:</strong> {feeRecord.specialty}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Fee Configuration</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Payment Plan:</strong> {feeRecord.paymentPlan === 'full' ? 'Full Payment' : 'Installments'}</div>
                      <div><strong>Late Fee:</strong> {feeRecord.lateFeeEnabled ? `$${feeRecord.lateFeeAmount}` : 'Disabled'}</div>
                      <div><strong>Created:</strong> {new Date(feeRecord.createdAt).toLocaleString()}</div>
                      <div><strong>Created By:</strong> {feeRecord.createdBy}</div>
                    </div>
                  </div>
                </div>

                {feeRecord.notes && (
                  <div>
                    <h4 className="font-medium mb-3">Internal Notes</h4>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm text-muted-foreground">{feeRecord.notes}</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="student" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={feeRecord.studentAvatar} alt={feeRecord.studentName} />
                      <AvatarFallback className="text-lg">
                        {feeRecord.studentName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{feeRecord.studentName}</h3>
                      <p className="text-muted-foreground">{feeRecord.studentEmail}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-muted-foreground" />
                          {feeRecord.studentEmail}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-muted-foreground" />
                          {feeRecord.studentPhone}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Academic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>University:</strong> {feeRecord.university}</div>
                        <div><strong>Specialty:</strong> {feeRecord.specialty}</div>
                        <div><strong>Semester:</strong> {feeRecord.semester}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payments" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Payment History</h3>
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Banknote className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{formatCurrency(payment.amount, feeRecord.currency)}</h4>
                            <p className="text-sm text-muted-foreground">
                              {payment.method} • {new Date(payment.date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Transaction ID: {payment.transactionId}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {payment.status}
                        </Badge>
                      </div>
                      {payment.note && (
                        <p className="text-sm text-muted-foreground mt-2 ml-13">
                          Note: {payment.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="actions" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Available Actions</h3>
                  
                  {feeRecord.status !== 'paid' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Record Payment</CardTitle>
                        <CardDescription>Manually record a payment for this fee</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Payment Note</label>
                          <Textarea
                            placeholder="Add details about the payment..."
                            value={paymentNote}
                            onChange={(e) => setPaymentNote(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <Button onClick={handleRecordPayment}>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Record Payment
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col space-y-2" onClick={handleDownloadInvoice}>
                      <Receipt className="w-5 h-5" />
                      <span className="text-sm">Download Invoice</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => toast.info('Email functionality coming soon!')}>
                      <Send className="w-5 h-5" />
                      <span className="text-sm">Email Invoice</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => toast.info('Refund processing coming soon!')}>
                      <DollarSign className="w-5 h-5" />
                      <span className="text-sm">Process Refund</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col space-y-2" onClick={() => toast.info('Payment plan modification coming soon!')}>
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm">Modify Payment Plan</span>
                    </Button>
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

export default FeeDetailPage;