'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Send, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Users,
  Filter,
  Search,
  ArrowLeft,
  Bell,
  Phone,
  FileText,
  Settings
} from 'lucide-react';

const PaymentRemindersPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('overdue');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [reminderType, setReminderType] = useState('email');
  const [customMessage, setCustomMessage] = useState('');
  const [scheduleReminder, setScheduleReminder] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  const overduePayments = [
    {
      id: 1,
      studentName: 'Emma Davis',
      studentEmail: 'emma.davis@email.com',
      studentPhone: '+237 123 456 789',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'UX Design Intern',
      company: 'Apple',
      feeAmount: 1680000, // 2800 USD converted to XAF
      dueDate: '2024-02-25',
      daysOverdue: 15,
      lastReminderSent: '2024-03-05',
      reminderCount: 2,
      status: 'overdue'
    },
    {
      id: 2,
      studentName: 'Michael Chen',
      studentEmail: 'michael.chen@email.com',
      studentPhone: '+237 987 654 321',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'Data Science Intern',
      company: 'Meta',
      feeAmount: 1320000, // 2200 USD converted to XAF
      dueDate: '2024-02-20',
      daysOverdue: 20,
      lastReminderSent: '2024-02-28',
      reminderCount: 3,
      status: 'overdue'
    },
    {
      id: 3,
      studentName: 'David Wilson',
      studentEmail: 'david.wilson@email.com',
      studentPhone: '+237 555 123 456',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'Marketing Intern',
      company: 'Netflix',
      feeAmount: 1200000, // 2000 USD converted to XAF
      dueDate: '2024-03-01',
      daysOverdue: 10,
      lastReminderSent: null,
      reminderCount: 0,
      status: 'overdue'
    }
  ];

  const upcomingPayments = [
    {
      id: 4,
      studentName: 'Lisa Anderson',
      studentEmail: 'lisa.anderson@email.com',
      studentPhone: '+237 444 555 666',
      studentAvatar: '/placeholder-avatar.jpg',
      internshipTitle: 'Product Management Intern',
      company: 'Microsoft',
      feeAmount: 1560000, // 2600 USD converted to XAF
      dueDate: '2024-03-15',
      daysUntilDue: 5,
      lastReminderSent: null,
      reminderCount: 0,
      status: 'pending'
    }
  ];

  const allPayments = [...overduePayments, ...upcomingPayments];

  const filteredPayments = allPayments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'overdue' && payment.status === 'overdue') ||
                         (selectedFilter === 'upcoming' && payment.status === 'pending');
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredPayments.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredPayments.map(p => p.id.toString()));
    }
  };

  const handleSendReminders = () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select at least one student');
      return;
    }

    const reminderMethod = reminderType === 'email' ? 'email' : 
                          reminderType === 'sms' ? 'SMS' : 'both email and SMS';
    
    if (scheduleReminder && !scheduleDate) {
      toast.error('Please select a schedule date');
      return;
    }

    if (scheduleReminder) {
      toast.success('Reminders scheduled!', {
        description: `${selectedStudents.length} reminder(s) scheduled for ${new Date(scheduleDate).toLocaleDateString()} via ${reminderMethod}.`
      });
    } else {
      toast.success('Reminders sent!', {
        description: `${selectedStudents.length} reminder(s) sent via ${reminderMethod}.`
      });
    }

    setSelectedStudents([]);
    setCustomMessage('');
    setScheduleReminder(false);
    setScheduleDate('');
  };

  const defaultMessages = {
    email: `Dear [Student Name],

This is a friendly reminder that your internship fee payment of [Amount] for [Internship Title] at [Company] is now overdue.

Original due date: [Due Date]
Days overdue: [Days Overdue]

Please make your payment as soon as possible to avoid any late fees. If you have already made the payment, please contact us with your payment confirmation.

You can make your payment through:
- Bank transfer
- Mobile money
- Online payment portal

If you have any questions or need assistance, please don't hesitate to contact us.

Best regards,
InternHub Finance Team`,
    sms: `Hi [Student Name], your internship fee of [Amount] for [Company] is overdue by [Days Overdue] days. Please make payment ASAP. Contact us if you need help. - InternHub`,
    both: `This reminder will be sent via both email and SMS using the respective templates above.`
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
            <h1 className="text-2xl font-bold text-foreground">Payment Reminders</h1>
            <p className="text-sm text-muted-foreground">Send payment reminders to students with overdue or upcoming fees</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => toast.info('Reminder templates coming soon!')}>
            <Settings className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button variant="outline" onClick={() => toast.info('Reminder history coming soon!')}>
            <FileText className="w-4 h-4 mr-2" />
            History
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{overduePayments.length}</p>
              <p className="text-sm text-muted-foreground">Overdue Payments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{upcomingPayments.length}</p>
              <p className="text-sm text-muted-foreground">Due Soon</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{selectedStudents.length}</p>
              <p className="text-sm text-muted-foreground">Selected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(overduePayments.reduce((sum, p) => sum + p.feeAmount, 0))}
              </p>
              <p className="text-sm text-muted-foreground">Total Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Students Requiring Reminders</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>
                <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
                  <TabsList>
                    <TabsTrigger value="overdue">Overdue</TabsTrigger>
                    <TabsTrigger value="upcoming">Due Soon</TabsTrigger>
                    <TabsTrigger value="all">All</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <CardDescription>Select students to send payment reminders</CardDescription>
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedStudents.length === filteredPayments.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {filteredPayments.map((payment) => (
                <div 
                  key={payment.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedStudents.includes(payment.id.toString()) 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleSelectStudent(payment.id.toString())}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={payment.studentAvatar} alt={payment.studentName} />
                        <AvatarFallback>{payment.studentName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">{payment.studentName}</h4>
                          <Badge variant={payment.status === 'overdue' ? 'destructive' : 'secondary'}>
                            {payment.status === 'overdue' ? (
                              <>
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {payment.daysOverdue} days overdue
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Due in {payment.daysUntilDue} days
                              </>
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {payment.internshipTitle} at {payment.company}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <span>Amount: {formatCurrency(payment.feeAmount)}</span>
                          <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                          <span>Email: {payment.studentEmail}</span>
                          <span>Phone: {payment.studentPhone}</span>
                        </div>
                        {payment.lastReminderSent && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Last reminder: {new Date(payment.lastReminderSent).toLocaleDateString()} 
                            ({payment.reminderCount} total)
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {selectedStudents.includes(payment.id.toString()) && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reminder Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="w-5 h-5 mr-2" />
              Send Reminders
            </CardTitle>
            <CardDescription>Configure and send payment reminders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Reminder Method</Label>
              <Select value={reminderType} onValueChange={setReminderType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Only
                    </div>
                  </SelectItem>
                  <SelectItem value="sms">
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      SMS Only
                    </div>
                  </SelectItem>
                  <SelectItem value="both">
                    <div className="flex items-center">
                      <Bell className="w-4 h-4 mr-2" />
                      Email + SMS
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Schedule Reminder</Label>
                  <p className="text-sm text-muted-foreground">Send reminder at a specific time</p>
                </div>
                <Switch
                  checked={scheduleReminder}
                  onCheckedChange={setScheduleReminder}
                />
              </div>

              {scheduleReminder && (
                <div className="space-y-2">
                  <Label htmlFor="scheduleDate">Schedule Date & Time</Label>
                  <Input
                    id="scheduleDate"
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Message Template</Label>
              <Textarea
                placeholder={defaultMessages[reminderType as keyof typeof defaultMessages]}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={8}
                className="text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Available variables: [Student Name], [Amount], [Company], [Internship Title], [Due Date], [Days Overdue]
              </p>
            </div>

            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="bg-muted/50 p-3 rounded-lg text-xs">
                <p className="font-medium mb-2">Recipients: {selectedStudents.length} student(s)</p>
                <p>Method: {reminderType === 'email' ? 'Email' : reminderType === 'sms' ? 'SMS' : 'Email + SMS'}</p>
                {scheduleReminder && scheduleDate && (
                  <p>Scheduled: {new Date(scheduleDate).toLocaleString()}</p>
                )}
              </div>
            </div>

            <Button 
              onClick={handleSendReminders} 
              className="w-full"
              disabled={selectedStudents.length === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              {scheduleReminder ? 'Schedule Reminders' : 'Send Reminders Now'}
            </Button>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => toast.info('Bulk email coming soon!')}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Bulk Email
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => toast.info('SMS campaign coming soon!')}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  SMS Campaign
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => toast.info('Auto-reminders coming soon!')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Setup Auto-Reminders
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentRemindersPage;