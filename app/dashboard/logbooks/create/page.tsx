'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save, Plus, X, BookOpen } from 'lucide-react';
import { apiFetch } from "@/lib/api";

interface Intern {
  id: string;
  name: string;
  company?: string;
}

const CreateLogbookPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    internId: '',
    date: new Date().toISOString().split('T')[0],
    title: '',
    content: '',
    hoursWorked: '',
    tasksCompleted: [] as string[],
    challenges: '',
    learnings: '',
    nextDayPlans: ''
  });

  const [newTask, setNewTask] = useState('');
  const [interns, setInterns] = useState<Intern[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await apiFetch('/admin/interns');
        if (response.ok) {
          const data = await response.json();
          // Transform the data to match the expected format
          const formattedInterns = data.map((intern: any) => ({
            id: intern.id.toString(),
            name: intern.name,
            company: intern.company_name
          }));
          setInterns(formattedInterns);
        } else {
          throw new Error('Failed to fetch interns');
        }
      } catch (error) {
        console.error('Error fetching interns:', error);
        toast.error('Failed to load interns data');
      }
    };

    fetchInterns();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.internId || !formData.title || !formData.content || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiFetch('/logbooks', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          hoursWorked: formData.hoursWorked ? parseFloat(formData.hoursWorked) : 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create logbook');
      }

      toast.success('Logbook entry created successfully!');
      router.push('/dashboard/logbooks');
    } catch (error: any) {
      console.error('Error creating logbook:', error);
      toast.error(error.message || 'Failed to create logbook');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTask = () => {
    if (newTask.trim() && !formData.tasksCompleted.includes(newTask.trim())) {
      setFormData(prev => ({
        ...prev,
        tasksCompleted: [...prev.tasksCompleted, newTask.trim()]
      }));
      setNewTask('');
      toast.success('Task added');
    }
  };

  const removeTask = (taskToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tasksCompleted: prev.tasksCompleted.filter(task => task !== taskToRemove)
    }));
    toast.info('Task removed');
  };

  return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Logbook Entry</h1>
            <p className="text-sm text-muted-foreground">Add a new daily logbook entry</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Entry Details
                </CardTitle>
                <CardDescription>Fill in the logbook entry information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="internId">Intern *</Label>
                    <Select
                        value={formData.internId}
                        onValueChange={(value) => handleInputChange('internId', value)}
                        required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select intern" />
                      </SelectTrigger>
                      <SelectContent>
                        {interns.map((intern) => (
                            <SelectItem key={intern.id} value={intern.id}>
                              {intern.name} {intern.company && `- ${intern.company}`}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Entry Title *</Label>
                  <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., React Component Development"
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hoursWorked">Hours Worked</Label>
                  <Input
                      id="hoursWorked"
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={formData.hoursWorked}
                      onChange={(e) => handleInputChange('hoursWorked', e.target.value)}
                      placeholder="8"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Daily Activities *</Label>
                  <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Describe what you worked on today, what you accomplished, and any important details..."
                      rows={6}
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenges">Challenges Faced</Label>
                  <Textarea
                      id="challenges"
                      value={formData.challenges}
                      onChange={(e) => handleInputChange('challenges', e.target.value)}
                      placeholder="Describe any challenges or obstacles you encountered..."
                      rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learnings">Key Learnings</Label>
                  <Textarea
                      id="learnings"
                      value={formData.learnings}
                      onChange={(e) => handleInputChange('learnings', e.target.value)}
                      placeholder="What did you learn today? Any new skills or insights..."
                      rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextDayPlans">Plans for Next Day</Label>
                  <Textarea
                      id="nextDayPlans"
                      value={formData.nextDayPlans}
                      onChange={(e) => handleInputChange('nextDayPlans', e.target.value)}
                      placeholder="What do you plan to work on tomorrow..."
                      rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tasks Completed */}
            <Card>
              <CardHeader>
                <CardTitle>Tasks Completed</CardTitle>
                <CardDescription>List the specific tasks you completed today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Task</Label>
                  <div className="flex space-x-2">
                    <Input
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Describe a completed task"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTask())}
                    />
                    <Button type="button" onClick={addTask} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Completed Tasks ({formData.tasksCompleted.length})</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto thin-scrollbar">
                    {formData.tasksCompleted.map((task, index) => (
                        <div key={index} className="flex items-start space-x-2 p-2 bg-muted/50 rounded">
                          <span className="text-sm flex-1">{task}</span>
                          <button
                              type="button"
                              onClick={() => removeTask(task)}
                              className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                    ))}
                    {formData.tasksCompleted.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No tasks added yet
                        </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                  'Creating...'
              ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Entry
                  </>
              )}
            </Button>
          </div>
        </form>
      </div>
  );
};

export default CreateLogbookPage;