'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Settings,
  Calendar,
  Users,
  MessageSquare,
  Paperclip,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2
} from 'lucide-react';

// Import your API functions
import { apiFetch } from '@/lib/api';
import {useRouter} from "next/navigation";
import {toast} from "sonner";

const TasksPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, task: null });
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('/tasks');
        if (response.success) {
          setTasks(response.data);
        } else {
          setError('Failed to load tasks');
        }
      } catch (err) {
        setError(err.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDeleteTask = async (taskId) => {
    try {
      setDeleting(true);
      const response = await apiFetch(`/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.success) {
        // Remove the task from the local state
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        setDeleteDialog({ open: false, task: null });

        console.log('Task deleted successfully');
        toast.success('Task deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete task');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message || 'Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteDialog = (task) => {
    setDeleteDialog({ open: true, task });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, task: null });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.specialty?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || task.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'done').length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'overdue': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'low': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-3 h-3 mr-1" />;
      case 'in_progress': return <AlertCircle className="w-3 h-3 mr-1" />;
      case 'completed': return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'overdue': return <XCircle className="w-3 h-3 mr-1" />;
      case 'cancelled': return <XCircle className="w-3 h-3 mr-1" />;
      default: return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  if (loading) {
    return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading tasks...</span>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Error Loading Tasks</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                  variant="outline"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Task Management</h1>
            <p className="text-sm text-muted-foreground">Manage internship tasks and assignments</p>
          </div>
          <Button onClick={() => {
            router.push('/dashboard/tasks/create');
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{taskStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{taskStats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{taskStats.in_progress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
                <p className="text-sm text-muted-foregreen">Completed</p>
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
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                  />
                </div>
                <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
                  <TabsList>
                    <TabsTrigger value="all">All Tasks</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                    <TabsTrigger value="done">Completed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No tasks found matching your criteria.</p>
                  </div>
              ) : (
                  filteredTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-foreground">{task.title}</h3>
                              <Badge className={getStatusColor(task.status)}>
                                {getStatusIcon(task.status)}
                                {task?.status?.replace('_', ' ')}
                              </Badge>
                              {task.priority && (
                                  <Badge className={getPriorityColor(task.priority)} variant="outline">
                                    {task.priority} priority
                                  </Badge>
                              )}
                            </div>

                            {task.description && (
                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                  {task.description}
                                </p>
                            )}

                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                              {task.specialty && (
                                  <div className="flex items-center">
                                    <Settings className="w-4 h-4 mr-1" />
                                    {task.specialty.name}
                                  </div>
                              )}
                              {task.due_date && (
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Due: {new Date(task.due_date).toLocaleDateString()}
                                  </div>
                              )}
                              {task.interns && task.interns.length > 0 && (
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {task.interns.length} intern{task.interns.length !== 1 ? 's' : ''}
                                  </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                              {task.comments && task.comments.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <div className="flex items-center">
                                      <MessageSquare className="w-4 h-4 mr-1" />
                                      {task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}
                                    </div>
                                  </>
                              )}
                              {task.attachments && task.attachments.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <div className="flex items-center">
                                      <Paperclip className="w-4 h-4 mr-1" />
                                      {task.attachments.length} attachment{task.attachments.length !== 1 ? 's' : ''}
                                    </div>
                                  </>
                              )}
                            </div>

                            {task.interns && task.interns.length > 0 && (
                                <div className="flex items-center space-x-2 mt-2">
                                  <span className="text-sm font-medium text-foreground">Assigned to:</span>
                                  <div className="flex -space-x-2">
                                    {task.interns.slice(0, 3).map((intern, index) => (
                                        <Avatar key={intern.id} className="h-6 w-6 border-2 border-background">
                                          <AvatarImage src={intern?.user?.avatar} alt={intern?.user.name} />
                                          <AvatarFallback className="text-xs">
                                            {intern?.user?.name?.split(' ').map(n => n[0]).join('') || 'IN'}
                                          </AvatarFallback>
                                        </Avatar>
                                    ))}
                                    {task.interns.length > 3 && (
                                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                          <span className="text-xs text-muted-foreground">+{task.interns.length - 3}</span>
                                        </div>
                                    )}
                                  </div>
                                </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={
                            () => router.push(`/dashboard/tasks/${task.id}`)
                          }>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" onClick={
                            () => router.push(`/dashboard/tasks/${task.id}/edit`)
                          }>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                  onClick={() => openDeleteDialog(task)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialog.open} onOpenChange={closeDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the task "{deleteDialog.task?.title}"?
                This action will permanently remove the task and all its related data including:
                <ul className="mt-2 ml-4 list-disc text-sm">
                  <li>All comments</li>
                  <li>All attachments</li>
                  <li>Intern assignments</li>
                  <li>Task progress data</li>
                </ul>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDeleteDialog} disabled={deleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                  onClick={() => handleDeleteTask(deleteDialog.task?.id)}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Task
                    </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  );
};

export default TasksPage;