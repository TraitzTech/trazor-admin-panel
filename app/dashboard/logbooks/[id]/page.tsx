'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

import { apiFetch, apiPost } from '@/lib/api'; // Helper wrappers

import {
  ArrowLeft,
  Edit,
  Calendar,
  Clock,
  User,
  Building,
  CheckCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  MoreHorizontal, Loader2
} from 'lucide-react';

const LogbookDetailPage = ({ params }: { params: { id: string } }) => {

  const [logbookEntry, setLogbookEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const router = useRouter();
  const {id} = params;
  const [reviewing, setReviewing] = useState<'approved' | 'needs_revision' | null>(null);


  useEffect(() => {
    const fetchLogbook = async () => {
      try {
        const data = await apiFetch(`/logbooks/${id}`);
        setLogbookEntry(data);
      } catch (error) {
        toast.error('Failed to load logbook');
      } finally {
        setLoading(false);
      }
    };
    fetchLogbook();
  }, [id]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'needs_revision':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4"/>;
      case 'pending':
        return <Clock className="w-4 h-4"/>;
      case 'needs_revision':
        return <AlertCircle className="w-4 h-4"/>;
      default:
        return <FileText className="w-4 h-4"/>;
    }
  };

  const handleApprove = () => {
    handleReview('approved');
  };

  const handleRequestRevision = () => {
    handleReview('needs_revision');
  };

  const handleEdit = () => {
    router.push(`/dashboard/logbooks/${params.id}/edit`);
  };

  const handleReview = async (status: 'approved' | 'needs_revision') => {
    if (status === 'needs_revision' && !feedback.trim()) {
      toast.error('Please provide feedback for revision');
      return;
    }

    setReviewing(status);

    try {
      await apiFetch(`/logbooks/${id}/review`, {
        method: 'POST',
        body: JSON.stringify({ status, feedback }),
      });

      toast.success(`Logbook ${status === 'approved' ? 'approved' : 'sent for revision'}`);

      setLogbookEntry((prev) => ({
        ...prev,
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'You',
      }));
      setFeedback('');
    } catch (err) {
      toast.error('Review action failed');
    } finally {
      setReviewing(null);
    }
  };


  const getInitials = (name?: string) => {
    return name?.split(' ').map(n => n[0]).join('') ?? 'IN';
  };

  const internName = logbookEntry?.intern?.user?.name || 'Unnamed';
  const internEmail = logbookEntry?.intern?.user?.email || 'No email';
  const internAvatar = logbookEntry?.intern?.user?.avatar || '';



  if (loading) {
    return <div className="p-6 text-center text-dark flex justify-center items-center h-64 gap-3">
      <Loader2 className="w-6 h-6 animate-spin"/>
      Loading logbook details...
    </div>;
  }
  if (!logbookEntry) return <div className="flex items-center justify-center h-64">Failed to Load logbook entry</div>;


  return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2"/>
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Logbook Entry Details</h1>
              <p className="text-sm text-muted-foreground">Review and manage logbook entry</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="w-4 h-4 mr-2"/>
              Edit
            </Button>
            {logbookEntry.status === 'pending' && (
                <Button onClick={handleApprove} className="flex-1" disabled={reviewing !== null}>
                  {reviewing === 'approved' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Approve
                </Button>

            )}
            <Button variant="outline">
              <MoreHorizontal className="w-4 h-4"/>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{logbookEntry.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1"/>
                      {new Date(logbookEntry.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1"/>
                      {logbookEntry.hoursWorked} hours
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(logbookEntry.status)}>
                  {getStatusIcon(logbookEntry.status)}
                  <span className="ml-2 capitalize">{logbookEntry.status.replace('_', ' ')}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Daily Activities</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">{logbookEntry.content}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Tasks Completed</h3>
                <ul className="space-y-2">
                  {Array.isArray(logbookEntry.tasks_completed) && logbookEntry.tasks_completed.map((task, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0"/>
                        <span className="text-muted-foreground">{task}</span>
                      </li>
                  ))}

                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Challenges Faced</h3>
                <p className="text-muted-foreground">{logbookEntry.challenges}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Key Learnings</h3>
                <p className="text-muted-foreground">{logbookEntry.learnings}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Plans for Next Day</h3>
                <p className="text-muted-foreground">{logbookEntry.next_day_plans}</p>
              </div>

              {logbookEntry.reviews?.length > 0 && (
                  <div className="bg-muted/50 p-4 rounded-lg space-y-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Supervisor Feedback
                    </h3>

                    {logbookEntry.reviews.map((review: any, index: number) => (
                        <div key={index} className="border-t pt-4">
                          <p className="text-muted-foreground whitespace-pre-wrap">{review.feedback}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            By {review.reviewer?.name || 'Unknown'} on{' '}
                            {new Date(review.created_at).toLocaleString()}
                          </p>
                        </div>
                    ))}
                  </div>
              )}

            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Intern Info */}
            <Card>
              <CardHeader>
                <CardTitle>Intern Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={internAvatar} alt={internName} />
                    <AvatarFallback>{getInitials(internName)}</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-medium">{internName}</p>
                    <p className="text-sm text-muted-foreground">{internEmail}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-3 text-muted-foreground"/>
                    <div>
                      <p className="font-medium">Institution</p>
                      <p className="text-muted-foreground">{logbookEntry.intern?.institution || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div>
                      <p className="font-medium">Supervisors</p>
                      {logbookEntry.intern?.specialty?.supervisors?.map((sup, index) => (
                          <div className="flex items-center" key={sup.id}>
                            <User className="w-4 h-4 mr-3 text-muted-foreground"/>
                            <div className="flex gap-1">
                              <p className="font-medium">{index + 1}.</p>
                              <p className="text-muted-foreground">{sup?.user?.name}</p>
                            </div>
                          </div>
                      ))}

                    </div>
                  </div>

                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-3 text-muted-foreground"/>
                    <div>
                      <p className="font-medium">Specialty</p>
                      <p className="text-muted-foreground">{logbookEntry.intern?.specialty?.name || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-3 text-muted-foreground"/>
                    <div>
                      <p className="font-medium">Matric Number</p>
                      <p className="text-muted-foreground">{logbookEntry.intern?.matric_number || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-3 text-muted-foreground"/>
                    <div>
                      <p className="font-medium">Hort Number</p>
                      <p className="text-muted-foreground">{logbookEntry.intern?.hort_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Entry Details */}
            <Card>
              <CardHeader>
                <CardTitle>Entry Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Submitted</p>
                  <p className="text-muted-foreground">{new Date(logbookEntry.submitted_at).toLocaleString()}</p>
                </div>
                {logbookEntry.reviewedAt && (
                    <div>
                      <p className="font-medium">Reviewed</p>
                      <p className="text-muted-foreground">{new Date(logbookEntry.reviewed_at).toLocaleString()}</p>
                    </div>
                )}
                <div>
                  <p className="font-medium">Hours Worked</p>
                  <p className="text-muted-foreground">{logbookEntry.hours_worked} hours</p>
                </div>
                <div>
                  <p className="font-medium">Tasks Completed</p>
                  <p className="text-muted-foreground">
                    {(logbookEntry.tasks_completed?.length || 0)} tasks
                  </p>

                </div>
              </CardContent>
            </Card>

            {/* Review Actions */}
            {logbookEntry.status === 'pending' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Actions</CardTitle>
                    <CardDescription>Approve or request revision</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Feedback (optional for approval, required for
                        revision)</label>
                      <Textarea
                          placeholder="Provide feedback to the intern..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          rows={4}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleApprove} className="flex-1">
                        <CheckCircle className="w-4 h-4 mr-2"/>
                        Approve
                      </Button>
                      <Button
                          variant="outline"
                          onClick={handleRequestRevision}
                          className="flex-1"
                          disabled={reviewing !== null}
                      >
                        {reviewing === 'needs_revision' ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <AlertCircle className="w-4 h-4 mr-2" />
                        )}
                        Request Revision
                      </Button>

                    </div>
                  </CardContent>
                </Card>
            )}
          </div>
        </div>
      </div>
  );
};
  export default LogbookDetailPage;
