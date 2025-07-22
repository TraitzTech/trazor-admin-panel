'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

import { apiFetch } from '@/lib/api';

const AnnouncementsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [specialtiesList, setSpecialtiesList] = useState<{ id: string; name: string }[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<any | null>(null);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    target: 'all',
    specialty: '',
    priority: 'normal'
  });
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/announcements')
        .then(res => setAnnouncements(res.announcements))
        .catch(() => toast.error('Failed to load announcements'));
  }, []);

  useEffect(() => {
    apiFetch('/specialties')
        .then(res => setSpecialtiesList(res.specialties))
        .catch(() => toast.error('Failed to load specialties'));
  }, []);

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || announcement.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'normal': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'low': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'scheduled': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'draft': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="w-3 h-3" />;
      case 'scheduled': return <Clock className="w-3 h-3" />;
      case 'draft': return <Edit className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

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
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Megaphone className="w-5 h-5 mr-2" />
                Create Announcement
              </CardTitle>
              <CardDescription>Send announcements to specific groups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                  placeholder="Title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              />
              <Textarea
                  placeholder="Content"
                  value={newAnnouncement.content}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              />
              <select
                  className="w-full p-2 border rounded-md bg-background"
                  value={newAnnouncement.target}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, target: e.target.value })}
              >
                <option value="all">All</option>
                <option value="interns">Interns</option>
                <option value="supervisors">Supervisors</option>
                <option value="specialty">Specialty</option>
              </select>
              {newAnnouncement.target === 'specialty' && (
                  <select
                      className="w-full p-2 border rounded-md bg-background"
                      value={newAnnouncement.specialty}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, specialty: e.target.value })}
                  >
                    <option value="">Select Specialty</option>
                    {specialtiesList.map((specialty) => (
                        <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
                    ))}
                  </select>
              )}
              <select
                  className="w-full p-2 border rounded-md bg-background"
                  value={newAnnouncement.priority}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
              <Button
                  className="w-full"
                  disabled={isSending}
                  onClick={async () => {
                    if (!newAnnouncement.title || !newAnnouncement.content) {
                      toast.error('Missing fields');
                      return;
                    }

                    setIsSending(true);
                    try {
                      await apiFetch('/announcements', {
                        method: 'POST',
                        body: JSON.stringify({
                          ...newAnnouncement,
                          specialty_id: newAnnouncement.target === 'specialty' ? newAnnouncement.specialty : null
                        })
                      });
                      toast.success('Announcement created');
                      setNewAnnouncement({ title: '', content: '', target: 'all', specialty: '', priority: 'normal' });
                      setAnnouncements(prev => [{ ...newAnnouncement, id: Date.now(), status: 'published' }, ...prev]); // optional refresh
                    } catch {
                      toast.error('Failed to create');
                    } finally {
                      setIsSending(false);
                    }
                  }}
              >
                {isSending ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4l4-4-4-4v4a12 12 0 00-12 12h4z"
                        />
                      </svg>
                      Sending...
                    </>
                ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </>
                )}
              </Button>

            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredAnnouncements.map(announcement => (
                  <div key={announcement.id} className="border rounded p-4">
                    <h3 className="font-semibold text-lg">{announcement.title}</h3>
                    <p className="text-sm text-muted-foreground">{announcement.content}</p>
                    <div className="flex space-x-2 mt-2">
                      <Badge className={getStatusColor(announcement.status)}>{announcement.status}</Badge>
                      <Badge className={getPriorityColor(announcement.priority)}>{announcement.priority}</Badge>
                    </div>

                  </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default AnnouncementsPage;
