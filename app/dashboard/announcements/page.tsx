'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  Send,
  Calendar,
  Users,
  Megaphone,
  Bell,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Save,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { apiFetch } from '@/lib/api';

const AnnouncementsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [specialtiesList, setSpecialtiesList] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // States for modals
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [announcementToEdit, setAnnouncementToEdit] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    target: 'all',
    specialty: '',
    priority: 'normal'
  });

  const [editAnnouncement, setEditAnnouncement] = useState({
    title: '',
    content: '',
    target: 'all',
    specialty: '',
    priority: 'normal'
  });

  const [announcements, setAnnouncements] = useState([]);

  // Load announcements
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch('/announcements');
        if (response.announcements) {
          setAnnouncements(response.announcements);
        }
      } catch (error) {
        console.error('Failed to load announcements:', error);
        toast.error('Failed to load announcements');
      } finally {
        setIsLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  // Load specialties
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const response = await apiFetch('/specialties');
        if (response.specialties) {
          setSpecialtiesList(response.specialties);
        }
      } catch (error) {
        console.error('Failed to load specialties:', error);
        toast.error('Failed to load specialties');
      }
    };

    loadSpecialties();
  }, []);

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || announcement.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'normal': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'low': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'scheduled': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-3 h-3" />;
      case 'scheduled': return <Clock className="w-3 h-3" />;
      case 'draft': return <Edit className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const handleSendAnnouncement = async () => {
    // Validation
    if (!newAnnouncement.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!newAnnouncement.content.trim()) {
      toast.error('Please enter content');
      return;
    }

    if (newAnnouncement.target === 'specialty' && !newAnnouncement.specialty) {
      toast.error('Please select a specialty');
      return;
    }

    setIsSending(true);

    try {
      // Prepare the data - fix the target field mismatch
      const announcementData = {
        title: newAnnouncement.title.trim(),
        content: newAnnouncement.content.trim(),
        target: newAnnouncement.target === 'supervisors' ? 'supervisor' :
            newAnnouncement.target === 'interns' ? 'intern' :
                newAnnouncement.target,
        priority: newAnnouncement.priority,
        specialty_id: newAnnouncement.target === 'specialty' ? newAnnouncement.specialty : null
      };

      console.log('Sending announcement data:', announcementData);

      const response = await apiFetch('/announcements', {
        method: 'POST',
        body: JSON.stringify(announcementData)
      });

      if (response.message) {
        toast.success(response.message);

        // Reset form
        setNewAnnouncement({
          title: '',
          content: '',
          target: 'all',
          specialty: '',
          priority: 'normal'
        });

        // Refresh announcements list
        const updatedResponse = await apiFetch('/announcements');
        if (updatedResponse.announcements) {
          setAnnouncements(updatedResponse.announcements);
        }
      }
    } catch (error) {
      console.error('Failed to create announcement:', error);
      toast.error(error.message || 'Failed to create announcement');
    } finally {
      setIsSending(false);
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setAnnouncementToEdit(announcement);
    setEditAnnouncement({
      title: announcement.title,
      content: announcement.content,
      target: announcement.target,
      specialty: announcement.specialty_id?.toString() || '',
      priority: announcement.priority || 'normal'
    });
    setShowEditDialog(true);
  };

  const handleUpdateAnnouncement = async () => {
    // Validation
    if (!editAnnouncement.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!editAnnouncement.content.trim()) {
      toast.error('Please enter content');
      return;
    }

    if (editAnnouncement.target === 'specialty' && !editAnnouncement.specialty) {
      toast.error('Please select a specialty');
      return;
    }

    setIsUpdating(true);

    try {
      const announcementData = {
        title: editAnnouncement.title.trim(),
        content: editAnnouncement.content.trim(),
        target: editAnnouncement.target,
        priority: editAnnouncement.priority,
        specialty_id: editAnnouncement.target === 'specialty' ? editAnnouncement.specialty : null
      };

      const response = await apiFetch(`/announcements/${announcementToEdit.id}`, {
        method: 'PUT',
        body: JSON.stringify(announcementData)
      });

      if (response.message) {
        toast.success(response.message);
        setShowEditDialog(false);
        setAnnouncementToEdit(null);

        // Refresh announcements list
        const updatedResponse = await apiFetch('/announcements');
        if (updatedResponse.announcements) {
          setAnnouncements(updatedResponse.announcements);
        }
      }
    } catch (error) {
      console.error('Failed to update announcement:', error);
      toast.error(error.message || 'Failed to update announcement');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;

    setIsDeleting(true);

    try {
      const response = await apiFetch(`/announcements/${announcementToDelete.id}`, {
        method: 'DELETE'
      });

      if (response.message) {
        toast.success(response.message);
        setAnnouncementToDelete(null);

        // Remove from local state
        setAnnouncements(prev => prev.filter(a => a.id !== announcementToDelete.id));
      }
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      toast.error(error.message || 'Failed to delete announcement');
    } finally {
      setIsDeleting(false);
    }
  };

  const getTargetOptions = () => [
    { value: 'all', label: 'All Users', icon: Users },
    { value: 'intern', label: 'Interns Only', icon: Users },
    { value: 'supervisor', label: 'Supervisors Only', icon: Users },
    { value: 'specialty', label: 'Specific Specialty', icon: Target }
  ];

  const getPriorityOptions = () => [
    { value: 'low', label: 'Low Priority', color: 'text-gray-600' },
    { value: 'normal', label: 'Normal Priority', color: 'text-blue-600' },
    { value: 'high', label: 'High Priority', color: 'text-red-600' }
  ];

  return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Announcement Management</h1>
            <p className="text-sm text-muted-foreground">Create and manage platform announcements</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Announcement Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Megaphone className="w-5 h-5 mr-2" />
                Create Announcement
              </CardTitle>
              <CardDescription>Send announcements to specific groups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                    placeholder="Enter announcement title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content *</label>
                <Textarea
                    placeholder="Enter announcement content"
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience *</label>
                <Select
                    value={newAnnouncement.target}
                    onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, target: value, specialty: '' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {getTargetOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            <option.icon className="w-4 h-4 mr-2" />
                            {option.label}
                          </div>
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newAnnouncement.target === 'specialty' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Specialty *</label>
                    <Select
                        value={newAnnouncement.specialty}
                        onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, specialty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialtiesList.map((specialty) => (
                            <SelectItem key={specialty.id} value={specialty.id.toString()}>
                              {specialty.name}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                    value={newAnnouncement.priority}
                    onValueChange={(value) => setNewAnnouncement({ ...newAnnouncement, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {getPriorityOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className={option.color}>{option.label}</span>
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                  className="w-full"
                  disabled={isSending}
                  onClick={handleSendAnnouncement}
              >
                {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Announcement
                    </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Announcements List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Announcements
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search announcements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span className="text-muted-foreground">Loading announcements...</span>
                  </div>
              ) : filteredAnnouncements.length > 0 ? (
                  filteredAnnouncements.map(announcement => (
                      <div key={announcement.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{announcement.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {announcement.content}
                            </p>
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getStatusColor(announcement.status || 'published')}>
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(announcement.status || 'published')}
                                  <span className="capitalize">{announcement.status || 'published'}</span>
                                </div>
                              </Badge>
                              <Badge className={getPriorityColor(announcement.priority || 'normal')}>
                                <span className="capitalize">{announcement.priority || 'normal'} Priority</span>
                              </Badge>
                              <Badge variant="outline">
                                <Target className="w-3 h-3 mr-1" />
                                <span className="capitalize">{announcement.target || 'All'}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(announcement.created_at).toLocaleDateString()}
                              {announcement.author && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <span>By {announcement.author.name}</span>
                                  </>
                              )}
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditAnnouncement(announcement)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                  onClick={() => setAnnouncementToDelete(announcement)}
                                  className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                  ))
              ) : (
                  <div className="text-center py-8">
                    <Megaphone className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No announcements found</h3>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm ? `No announcements match "${searchTerm}"` : 'Create your first announcement to get started'}
                    </p>
                  </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Announcement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                    placeholder="Enter announcement title"
                    value={editAnnouncement.title}
                    onChange={(e) => setEditAnnouncement({ ...editAnnouncement, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content *</label>
                <Textarea
                    placeholder="Enter announcement content"
                    value={editAnnouncement.content}
                    onChange={(e) => setEditAnnouncement({ ...editAnnouncement, content: e.target.value })}
                    rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience *</label>
                <Select
                    value={editAnnouncement.target}
                    onValueChange={(value) => setEditAnnouncement({ ...editAnnouncement, target: value, specialty: '' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {getTargetOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            <option.icon className="w-4 h-4 mr-2" />
                            {option.label}
                          </div>
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {editAnnouncement.target === 'specialty' && (
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Specialty *</label>
                      <Select
                          value={editAnnouncement.specialty}
                          onValueChange={(value) => setEditAnnouncement({ ...editAnnouncement, specialty: value })}
                      >
                          <SelectTrigger>
                              <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                          <SelectContent>
                              {specialtiesList.map((specialty) => (
                                  <SelectItem key={specialty.id} value={specialty.id.toString()}>
                                      {specialty.name}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                  </div>
              )}

                <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select
                        value={editAnnouncement.priority}
                        onValueChange={(value) => setEditAnnouncement({ ...editAnnouncement, priority: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            {getPriorityOptions().map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    <span className={option.color}>{option.label}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
              <DialogFooter>
                  <Button
                      variant="outline"
                      onClick={() => setShowEditDialog(false)}
                      disabled={isUpdating}
                  >
                      Cancel
                  </Button>
                  <Button
                      onClick={handleUpdateAnnouncement}
                      disabled={isUpdating}
                  >
                      {isUpdating ? (
                          <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Updating...
                          </>
                      ) : (
                          <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                          </>
                      )}
                  </Button>
              </DialogFooter>
          </DialogContent>
        </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
              open={!!announcementToDelete}
              onOpenChange={(open) => !open && setAnnouncementToDelete(null)}
          >
              <AlertDialogContent>
                  <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete this announcement?</AlertDialogTitle>
                      <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the announcement titled
                          <span className="font-medium"> "{announcementToDelete?.title}"</span>.
                      </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>
                          Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                          onClick={handleDeleteAnnouncement}
                          className="bg-destructive hover:bg-destructive/90"
                          disabled={isDeleting}
                      >
                          {isDeleting ? (
                              <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Deleting...
                              </>
                          ) : (
                              <>
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                              </>
                          )}
                      </AlertDialogAction>
                  </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
      </div>
  );
};

export default AnnouncementsPage;