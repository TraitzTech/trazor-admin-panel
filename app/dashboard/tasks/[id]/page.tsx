'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import {
    ArrowLeft, Edit, Calendar, Clock, CheckCircle, AlertCircle,
    FileText, MessageSquare, MoreHorizontal, Loader2, Paperclip,
    XCircle, Settings, Target, Flag, Play, Pause, Trash2, Download
} from 'lucide-react';
import { ThumbsUp, Reply } from 'lucide-react';

interface Attachment {
    id: number;
    original_name: string;
    file_size?: number;
    path: string;
    description?: string;
    uploaded_by?: string;
    created_at: string;
    updated_at: string;
}

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user?: {
        name?: string;
        avatar?: string;
    };
}

// Update your interfaces first
interface InternSubmission {
    status: 'pending' | 'in_progress' | 'done' | 'cancelled';
    started_at?: string;
    completed_at?: string;
    intern_notes?: string;
    assigned_at?: string;
    updated_at?: string;
}

interface TaskIntern {
    id: number;
    user_id: string;
    institution: string;
    matric_number: string;
    hort_number: string;
    user?: {
        name?: string;
        email?: string;
        avatar?: string;
    };
    specialty?: {
        id: number;
        name: string;
    };
    submission: InternSubmission; // This contains the pivot data
}

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority?: string;
    due_date?: string;
    created_at: string;
    updated_at: string;
    interns: TaskIntern[]; // Updated to use TaskIntern interface
    specialty?: {
        id: number;
        name: string;
    };
    comments: Comment[];
    attachments: Attachment[];
}

const TaskDetailPage = ({ params }: { params: { id: string } }) => {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [fileDescription, setFileDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [deletingAttachment, setDeletingAttachment] = useState<number | null>(null);
    const [editingComment, setEditingComment] = useState<Comment | null>(null);
    const [deletingComment, setDeletingComment] = useState<number | null>(null);
    const router = useRouter();
    const { id } = params;

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await apiFetch(`/tasks/${id}`);
                if (response.success && response.data) {
                    setTask(response.data);
                } else {
                    throw new Error('Invalid task data received');
                }
            } catch (error) {
                toast.error('Failed to load task');
                console.error('Error fetching task:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleEditComment = (comment: Comment) => {
        setEditingComment(comment);
        setComment(comment.body);
    };

    const handleCancelEdit = () => {
        setEditingComment(null);
        setComment('');
    };
    const handleUpdateComment = async () => {
        if (!editingComment || !comment.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        try {
            await apiFetch(`/comments/${editingComment.id}`, {
                method: 'PUT',
                body: JSON.stringify({ body: comment }),
            });

            toast.success('Comment updated successfully');
            setEditingComment(null);
            setComment('');
            const updatedTask = await apiFetch(`/tasks/${id}`);
            if (updatedTask?.data) {
                setTask(updatedTask.data);
            }
        } catch (err) {
            toast.error('Failed to update comment');
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        setDeletingComment(commentId);
        try {
            await apiFetch(`/comments/${commentId}`, {
                method: 'DELETE',
            });

            toast.success('Comment deleted successfully');
            const updatedTask = await apiFetch(`/tasks/${id}`);
            if (updatedTask?.data) {
                setTask(updatedTask.data);
            }
        } catch (err) {
            toast.error('Failed to delete comment');
        } finally {
            setDeletingComment(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done':
                return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            case 'in_progress':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
            case 'overdue':
                return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
            case 'cancelled':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const getSubmissionStatusColor = (status: string) => {
        switch (status) {
            case 'done':
                return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            case 'in_progress':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
            case 'cancelled':
                return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const calculateTimeTaken = (startedAt?: string, completedAt?: string) => {
        if (!startedAt || !completedAt) return null;

        const start = new Date(startedAt);
        const end = new Date(completedAt);
        const diffInHours = Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return `${Math.round(diffInHours * 60)} minutes`;
        } else if (diffInHours < 24) {
            return `${Math.round(diffInHours)} hours`;
        } else {
            return `${Math.round(diffInHours / 24)} days`;
        }
    };

    const handleInternStatusUpdate = async (internId: number, newStatus: string, notes?: string) => {
        try {
            await apiFetch(`/tasks/${id}/intern/status`, {
                method: 'PUT',
                body: JSON.stringify({
                    intern_id: internId,
                    status: newStatus,
                    intern_notes: notes,
                }),
            });

            toast.success('Intern status updated successfully');

            // Refresh task data
            const updatedTask = await apiFetch(`/tasks/${id}`);
            if (updatedTask?.data) {
                setTask(updatedTask.data);
            }
        } catch (err) {
            toast.error('Failed to update intern status');
            console.error('Error updating intern status:', err);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
            case 'medium':
                return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
            case 'low':
                return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'done':
                return <CheckCircle className="w-4 h-4" />;
            case 'in_progress':
                return <Play className="w-4 h-4" />;
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'overdue':
                return <AlertCircle className="w-4 h-4" />;
            case 'cancelled':
                return <XCircle className="w-4 h-4" />;
            default:
                return <FileText className="w-4 h-4" />;
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        setUpdating(newStatus);
        try {
            await apiFetch(`/tasks/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus }),
            });

            toast.success(`Task status updated to ${newStatus.replace('_', ' ')}`);
            setTask(prev => ({ ...prev, status: newStatus }));
        } catch (err) {
            toast.error('Failed to update task status');
        } finally {
            setUpdating(null);
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        try {
            await apiFetch(`/tasks/comments`, {
                method: 'POST',
                body: JSON.stringify({ body: comment, task_id: id }),

            });

            toast.success('Comment added successfully');
            setComment('');
            const updatedTask = await apiFetch(`/tasks/${id}`);
            if (updatedTask?.data) {
                setTask(updatedTask.data);
            }

        } catch (err) {
            toast.error('Failed to add comment');
        }
    };

    const handleEdit = () => {
        router.push(`/dashboard/tasks/${id}/edit`);
    };

    const getInitials = (name?: string) => {
        return name?.split(' ').map(n => n[0]).join('') ?? 'IN';
    };

    const handleFileUpload = async () => {
        if (!file) {
            toast.error('Please select a file to upload');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('task_id', id); // Add the task ID
            if (fileDescription) {
                formData.append('description', fileDescription);
            }

            // Use the correct endpoint based on your routes
            // Try this endpoint first (based on your routes)
            const response = await apiFetch(`/tasks/${id}/attachments`, {
                method: 'POST',
                body: formData, // Don't stringify FormData
            });

            if (response.success) {
                toast.success('File uploaded successfully');
                setFile(null);
                setFileDescription('');
                // Refresh task data
                const updatedTask = await apiFetch(`/tasks/${id}`);
                if (updatedTask?.data) {
                    setTask(updatedTask.data);
                }
            } else {
                throw new Error(response.message || 'Failed to upload file');
            }
        } catch (err) {
            toast.error('Failed to upload file');
            console.error('Error uploading file:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleDownloadAttachment = async (attachmentId: number) => {
        try {
            const blob = await apiFetch(`/attachments/${attachmentId}/download`, {
                method: 'GET',
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Optional: fixed filename or retrieved from backend
            const filename = `attachment-${attachmentId}.pdf`;
            link.setAttribute('download', filename);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            toast.error('Failed to download file');
            console.error('Error downloading file:', err);
        }
    };


    const handleDeleteAttachment = async (attachmentId: number) => {
        if (!confirm('Are you sure you want to delete this attachment?')) return;

        setDeletingAttachment(attachmentId);
        try {
            const response = await apiFetch(`/attachments/${attachmentId}`, {
                method: 'DELETE',
            });

            if (response.success) {
                toast.success('Attachment deleted successfully');
                // Refresh task data
                const updatedTask = await apiFetch(`/tasks/${id}`);
                if (updatedTask?.data) {
                    setTask(updatedTask.data);
                }
            } else {
                throw new Error(response.message || 'Failed to delete attachment');
            }
        } catch (err) {
            toast.error('Failed to delete attachment');
            console.error('Error deleting attachment:', err);
        } finally {
            setDeletingAttachment(null);
        }
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <div className="p-6 text-center text-dark flex justify-center items-center h-64 gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                Loading task details...
            </div>
        );
    }

    if (!task) {
        return (
            <div className="flex items-center justify-center h-64">
                Failed to load task details
            </div>
        );
    }

    const InternSubmissionsCard = () => {
        if (!task?.interns || task.interns.length === 0) return null;

        const totalInterns = task.interns.length;
        const completedCount = task.interns.filter(intern => intern.submission.status === 'done').length;
        const inProgressCount = task.interns.filter(intern => intern.submission.status === 'in_progress').length;
        const pendingCount = task.interns.filter(intern => intern.submission.status === 'pending').length;
        const completionRate = totalInterns > 0 ? Math.round((completedCount / totalInterns) * 100) : 0;

        return (
            <Card>
                <CardHeader>
                    <CardTitle>Intern Submissions ({totalInterns})</CardTitle>
                    <CardDescription>
                        {completionRate}% completion rate • {completedCount} completed, {inProgressCount} in progress, {pendingCount} pending
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Progress Summary */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        <div className="text-center p-2 bg-green-50 rounded dark:bg-green-900/20">
                            <div className="text-lg font-bold text-green-700 dark:text-green-300">{completedCount}</div>
                            <div className="text-xs text-green-600 dark:text-green-400">Done</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded dark:bg-blue-900/20">
                            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{inProgressCount}</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400">In Progress</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-50 rounded dark:bg-yellow-900/20">
                            <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300">{pendingCount}</div>
                            <div className="text-xs text-yellow-600 dark:text-yellow-400">Pending</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded dark:bg-gray-800">
                            <div className="text-lg font-bold text-gray-700 dark:text-gray-300">{completionRate}%</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">Complete</div>
                        </div>
                    </div>

                    {/* Individual Intern Submissions */}
                    <div className="space-y-3">
                        {task.interns.map((intern) => (
                            <div key={intern.id} className="border rounded-lg p-3 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={intern.user?.avatar} alt={intern.user?.name} />
                                            <AvatarFallback className="text-xs">
                                                {getInitials(intern.user?.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-sm">{intern.user?.name || 'Unknown'}</p>
                                            <p className="text-xs text-muted-foreground">{intern.matric_number}</p>
                                            {intern.institution && (
                                                <p className="text-xs text-muted-foreground">{intern.institution}</p>
                                            )}
                                        </div>
                                    </div>
                                    <Badge className={getSubmissionStatusColor(intern.submission.status)}>
                                        {intern.submission.status.replace('_', ' ')}
                                    </Badge>
                                </div>

                                {/* Submission Details */}
                                <div className="text-xs text-muted-foreground space-y-1 pl-11">
                                    {intern.submission.assigned_at && (
                                        <div>Assigned: {new Date(intern.submission.assigned_at).toLocaleDateString()}</div>
                                    )}
                                    {intern.submission.started_at && (
                                        <div>Started: {new Date(intern.submission.started_at).toLocaleString()}</div>
                                    )}
                                    {intern.submission.completed_at && (
                                        <div>Completed: {new Date(intern.submission.completed_at).toLocaleString()}</div>
                                    )}
                                    {intern.submission.started_at && intern.submission.completed_at && (
                                        <div className="font-medium text-green-600">
                                            Time taken: {calculateTimeTaken(intern.submission.started_at, intern.submission.completed_at)}
                                        </div>
                                    )}
                                    {intern.submission.intern_notes && (
                                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                                            <strong>Notes:</strong> {intern.submission.intern_notes}
                                        </div>
                                    )}
                                </div>

                                {/* Quick Actions for Each Intern */}
                                <div className="flex gap-2 pl-11">
                                    {intern.submission.status === 'pending' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleInternStatusUpdate(intern.id, 'in_progress')}
                                        >
                                            Start
                                        </Button>
                                    )}
                                    {intern.submission.status === 'in_progress' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleInternStatusUpdate(intern.id, 'done')}
                                        >
                                            Complete
                                        </Button>
                                    )}
                                    {intern.submission.status === 'done' && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleInternStatusUpdate(intern.id, 'in_progress')}
                                        >
                                            Reopen
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
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
                        <h1 className="text-2xl font-bold text-foreground">Task Details</h1>
                        <p className="text-sm text-muted-foreground">Manage and track task progress</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={handleEdit}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    {task.status === 'pending' && (
                        <Button
                            onClick={() => handleStatusUpdate('in_progress')}
                            disabled={updating !== null}
                        >
                            {updating === 'in_progress' ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Play className="w-4 h-4 mr-2" />
                            )}
                            Start Task
                        </Button>
                    )}
                    {task.status === 'in_progress' && (
                        <Button
                            onClick={() => handleStatusUpdate('done')}
                            disabled={updating !== null}
                        >
                            {updating === 'completed' ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <CheckCircle className="w-4 h-4 mr-2" />
                            )}
                            Complete
                        </Button>
                    )}
                    <Button variant="outline">
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-xl">{task.title}</CardTitle>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                                    {task.created_at && (
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            Created: {new Date(task.created_at).toLocaleDateString()}
                                        </div>
                                    )}
                                    {task.due_date && (
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            Due: {new Date(task.due_date).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(task.status)}>
                                    {getStatusIcon(task.status)}
                                    <span className="ml-2 capitalize">{task?.status?.replace('_', ' ') ?? ''}</span>
                                </Badge>
                                {task.priority && (
                                    <Badge className={getPriorityColor(task.priority)} variant="outline">
                                        <Flag className="w-3 h-3 mr-1" />
                                        {task.priority} priority
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {task.description && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Task Description</h3>
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-muted-foreground whitespace-pre-wrap">{task.description}</p>
                                </div>
                            </div>
                        )}
                        {task.attachments && task.attachments.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <Paperclip className="w-5 h-5 mr-2" />
                                    Attachments ({task.attachments.length})
                                </h3>
                                <div className="space-y-3">
                                    {task.attachments.map((attachment) => (
                                        <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <FileText className="w-5 h-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium text-sm">{attachment.original_name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatFileSize(attachment.file_size)}
                                                        {attachment.description && ` • ${attachment.description}`}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDownloadAttachment(attachment.id)}
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteAttachment(attachment.id)}
                                                    disabled={deletingAttachment === attachment.id}
                                                >
                                                    {deletingAttachment === attachment.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {task.comments && task.comments.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <MessageSquare className="w-5 h-5 mr-2" />
                                    Comments ({task.comments.length})
                                </h3>
                                <div className="space-y-6">
                                    {task.comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="flex items-start gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:bg-muted/50"
                                        >
                                            <Avatar className="h-10 w-10 border">
                                                <AvatarImage src={comment.user?.avatar} alt={comment.user?.name} />
                                                <AvatarFallback className="text-sm font-medium">
                                                    {getInitials(comment.user?.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-sm">{comment.user?.name || 'Unknown User'}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(comment.created_at).toLocaleString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                            onClick={() => handleEditComment(comment)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            disabled={deletingComment === comment.id}
                                                        >
                                                            {deletingComment === comment.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="h-4 w-4 text-red-500" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="prose prose-sm max-w-none">
                                                    <p className="text-sm text-foreground whitespace-pre-wrap">
                                                        {comment.body}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 pt-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                                    >
                                                        <ThumbsUp className="h-4 w-4 mr-1" />
                                                        <span className="text-xs">Like</span>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                                    >
                                                        <Reply className="h-4 w-4 mr-1" />
                                                        <span className="text-xs">Reply</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </CardContent>
                </Card>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Task Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Task Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3 text-sm">
                                {task.specialty && (
                                    <div className="flex items-center">
                                        <Settings className="w-4 h-4 mr-3 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Specialty</p>
                                            <p className="text-muted-foreground">{task.specialty.name}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center">
                                    <Target className="w-4 h-4 mr-3 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Status</p>
                                        <p className="text-muted-foreground capitalize">{task.status.replace('_', ' ')}</p>
                                    </div>
                                </div>

                                {task.priority && (
                                    <div className="flex items-center">
                                        <Flag className="w-4 h-4 mr-3 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Priority</p>
                                            <p className="text-muted-foreground capitalize">{task.priority}</p>
                                        </div>
                                    </div>
                                )}

                                {task.created_at && (
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Created</p>
                                            <p className="text-muted-foreground">
                                                {new Date(task.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {task.due_date && (
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-3 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">Due Date</p>
                                            <p className="text-muted-foreground">
                                                {new Date(task.due_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center">
                                    <MessageSquare className="w-4 h-4 mr-3 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Comments</p>
                                        <p className="text-muted-foreground">{task.comments?.length || 0} comments</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Paperclip className="w-4 h-4 mr-3 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Attachments</p>
                                        <p className="text-muted-foreground">{task.attachments?.length || 0} files</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Assigned Interns */}
                    <InternSubmissionsCard />

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {task.status === 'pending' && (
                                <Button
                                    onClick={() => handleStatusUpdate('in_progress')}
                                    className="w-full"
                                    disabled={updating !== null}
                                >
                                    {updating === 'in_progress' ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Play className="w-4 h-4 mr-2" />
                                    )}
                                    Start Task
                                </Button>
                            )}

                            {task.status === 'in_progress' && (
                                <>
                                    <Button
                                        onClick={() => handleStatusUpdate('done')}
                                        className="w-full"
                                        disabled={updating !== null}
                                    >
                                        {updating === 'completed' ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                        )}
                                        Mark Complete
                                    </Button>
                                    <Button
                                        onClick={() => handleStatusUpdate('pending')}
                                        variant="outline"
                                        className="w-full"
                                        disabled={updating !== null}
                                    >
                                        {updating === 'pending' ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Pause className="w-4 h-4 mr-2" />
                                        )}
                                        Pause Task
                                    </Button>
                                </>
                            )}

                            {(task.status === 'done' || task.status === 'cancelled') && (
                                <Button
                                    onClick={() => handleStatusUpdate('in_progress')}
                                    variant="outline"
                                    className="w-full"
                                    disabled={updating !== null}
                                >
                                    {updating === 'in_progress' ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Play className="w-4 h-4 mr-2" />
                                    )}
                                    Reopen Task
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Add Comment */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {editingComment ? 'Edit Comment' : 'Add Comment'}
                            </CardTitle>
                            <CardDescription>
                                {editingComment ? 'Update your comment' : 'Leave a comment or update'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Textarea
                                    placeholder={editingComment ? 'Update your comment...' : 'Add a comment or update...'}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                />
                            </div>
                            <div className="flex gap-2">
                                {editingComment ? (
                                    <>
                                        <Button onClick={handleUpdateComment} className="flex-1">
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Update Comment
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleCancelEdit}
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={handleAddComment} className="w-full">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Add Comment
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Add the file upload section to your sidebar */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Attachment</CardTitle>
                            <CardDescription>Upload files related to this task</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <Input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.zip,.rar,.txt"
                                />
                                <Textarea
                                    placeholder="File description (optional)"
                                    value={fileDescription}
                                    onChange={(e) => setFileDescription(e.target.value)}
                                    rows={2}
                                />
                            </div>
                            <Button
                                onClick={handleFileUpload}
                                className="w-full"
                                disabled={!file || uploading}
                            >
                                {uploading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Paperclip className="w-4 h-4 mr-2" />
                                )}
                                Upload File
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailPage;