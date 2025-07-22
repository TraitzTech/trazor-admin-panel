'use client';

import {useEffect, useState} from 'react';
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
  Calendar,
  Clock,
  User,
  Building,
  BookOpen,
  CheckCircle,
  AlertCircle,
  FileText,
  Download, Loader2
} from 'lucide-react';
import {apiFetch} from "@/lib/api";

const LogbooksPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedIntern, setSelectedIntern] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('week');
  const [loading, setLoading] = useState(true);

  const [feedbackMap, setFeedbackMap] = useState<{ [key: number]: string }>({});
  const [reviewing, setReviewing] = useState<{ id: number | null; action: 'approved' | 'needs_revision' | null }>({
    id: null,
    action: null
  });



  const [logbookEntries, setLogbookEntries] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLogbooks = async () => {
      try {
        const data = await apiFetch('/logbooks');
        setLogbookEntries(data);
      } catch (err) {
        toast.error('Failed to load logbooks');
      } finally {
        setLoading(false);
      }
    };
    fetchLogbooks();
  }, []);

  const filteredEntries = logbookEntries.filter(entry => {
    const internName = entry.intern.user.email || 'Not Set';
    const title = entry.title || '';
    const content = entry.content || '';
    const status = entry.status || '';

    const matchesSearch = internName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = selectedFilter === 'all' || status === selectedFilter;
    const matchesIntern = selectedIntern === 'all' || internName === selectedIntern;

    return matchesSearch && matchesFilter && matchesIntern;
  });


  const logbookStats = {
    total: logbookEntries.length,
    pending: logbookEntries.filter(e => e.status === 'pending').length,
    approved: logbookEntries.filter(e => e.status === 'approved').length,
    needsRevision: logbookEntries.filter(e => e.status === 'needs_revision').length,
    totalHours: logbookEntries.reduce((sum, e) => sum + e.hoursWorked, 0),
    avgHours: (logbookEntries.reduce((sum, e) => sum + e.hoursWorked, 0) / logbookEntries.length).toFixed(1)
  };

  const uniqueInterns = [...new Set(logbookEntries.map(entry => entry.internName))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'needs_revision': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'needs_revision': return <AlertCircle className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  const handleViewEntry = (entryId: number) => {
    router.push(`/dashboard/logbooks/${entryId}`);
  };


  const handleApproveEntry = (entry: any) => {
    handleReview(entry.id, 'approved');
  };

  const handleRequestRevision = (entry: any) => {
    handleReview(entry.id, 'needs_revision');
  };


  const handleReview = async (entryId: number, status: 'approved' | 'needs_revision') => {
    const feedback = feedbackMap[entryId] || '';

    if (status === 'needs_revision' && !feedback.trim()) {
      toast.error('Please provide feedback for revision');
      return;
    }

    setReviewing({ id: entryId, action: status });


    try {
      await apiFetch(`/logbooks/${entryId}/review`, {
        method: 'POST',
        body: JSON.stringify({ status, feedback }),
      });

      toast.success(`Logbook ${status === 'approved' ? 'approved' : 'sent for revision'}`);

      // Update local state
      setLogbookEntries((prev) =>
          prev.map((entry) =>
              entry.id === entryId
                  ? {
                    ...entry,
                    status,
                    reviewedAt: new Date().toISOString(),
                    reviewedBy: 'You',
                  }
                  : entry
          )
      );
      // Clear feedback
      setFeedbackMap((prev) => ({ ...prev, [entryId]: '' }));
    } catch (err) {
      toast.error('Review action failed');
    } finally {
      setReviewing({ id: null, action: null });

    }
  };


  const handleExportData = () => {
    toast.success('Export started', {
      description: 'Logbook data is being prepared for download.'
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return 'IN';
    return name.split(' ').map(n => n[0]).join('');
  };


  if (loading) {
    return <div className="p-6 text-center text-dark flex justify-center items-center h-64 gap-3">
      <Loader2 className="w-6 h-6 animate-spin" />
      Loading Logbooks...
    </div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Logbook Management</h1>
          <p className="text-sm text-muted-foreground">View and manage intern daily logbook entries</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => router.push('/dashboard/logbooks/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{logbookStats.total}</p>
              <p className="text-sm text-muted-foreground">Total Entries</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{logbookStats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{logbookStats.approved}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{logbookStats.needsRevision}</p>
              <p className="text-sm text-muted-foreground">Needs Revision</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{logbookStats.totalHours}</p>
              <p className="text-sm text-muted-foreground">Total Hours</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{logbookStats.avgHours}</p>
              <p className="text-sm text-muted-foreground">Avg Hours/Day</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search logbook entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
                <TabsList>
                  <TabsTrigger value="all">All Entries</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="needs_revision">Needs Revision</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedIntern} onValueChange={setSelectedIntern}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by intern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Interns</SelectItem>
                  {uniqueInterns.map((intern) => (
                    <SelectItem key={intern} value={intern}>{intern}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[calc(100vh-24rem)] overflow-y-auto custom-scrollbar">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={entry.internAvatar} alt={entry.internName} />
                      <AvatarFallback>{getInitials(entry.internName)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-foreground">{entry.title}</h3>
                        <Badge className={getStatusColor(entry.status)}>
                          {getStatusIcon(entry.status)}
                          <span className="ml-1 capitalize">{entry.status.replace('_', ' ')}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {entry.hours_worked}h
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {entry.intern?.user?.name ?? 'Unknown Intern'}
                        </div>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          {entry.intern?.institution ?? 'Unknown Institution'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(entry.date).toLocaleDateString()}
                        </div>

                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {entry.content}
                      </p>

                      <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                        {entry.intern?.specialty?.name ?? 'No Specialty'}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Submitted: {new Date(entry.submitted_at).toLocaleString()}</span>
                        {entry.reviewedAt && (
                          <>
                            <span>•</span>
                            <span>Reviewed: {new Date(entry.reviewedAt).toLocaleString()}</span>
                            <span>•</span>
                            <span>By: {entry.reviewedBy}</span>
                          </>
                        )}
                      </div>

                      {Array.isArray(entry.tasksCompleted) && entry.tasksCompleted.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-foreground mb-1">Tasks Completed:</p>
                            <div className="flex flex-wrap gap-1">
                              {entry.tasksCompleted.slice(0, 3).map((task, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {task}
                                  </Badge>
                              ))}
                              {entry.tasksCompleted.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{entry.tasksCompleted.length - 3} more
                                  </Badge>
                              )}
                            </div>
                          </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleViewEntry(entry.id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    {entry.status === 'pending' && (
                        <div className="space-y-2">
    <textarea
        rows={2}
        placeholder="Feedback for revision (required if requesting revision)"
        className="text-sm p-2 border rounded w-full text-muted-foreground"
        value={feedbackMap[entry.id] || ''}
        onChange={(e) =>
            setFeedbackMap((prev) => ({ ...prev, [entry.id]: e.target.value }))
        }
    />
                          <div className="flex space-x-2">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleReview(entry.id, 'approved')}
                                disabled={reviewing.id === entry.id && reviewing.action !== null}
                            >
                              {reviewing.id === entry.id && reviewing.action === 'approved' ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                  <CheckCircle className="w-4 h-4 mr-2" />
                              )}
                              Approve
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReview(entry.id, 'needs_revision')}
                                disabled={reviewing.id === entry.id && reviewing.action !== null}
                            >
                              {reviewing.id === entry.id && reviewing.action === 'needs_revision' ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                  <AlertCircle className="w-4 h-4 mr-2" />
                              )}
                              Request Revision
                            </Button>

                          </div>
                        </div>
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

export default LogbooksPage;