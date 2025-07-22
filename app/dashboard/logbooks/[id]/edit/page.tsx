'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Save, Plus, X, BookOpen } from 'lucide-react';

const EditLogbookPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: 'React Component Development',
    date: '2024-01-22',
    content: 'Today I worked on developing reusable React components for the user dashboard. I learned about component composition patterns and implemented proper prop validation using TypeScript. The components are now more maintainable and follow the company\'s design system guidelines.',
    hoursWorked: '8',
    tasksCompleted: [
      'Implemented UserCard component with proper TypeScript interfaces',
      'Added prop validation and default props',
      'Wrote unit tests using Jest and React Testing Library'
    ],
    challenges: 'Understanding complex state management patterns and ensuring components are truly reusable across different contexts.',
    learnings: 'Gained deeper knowledge of React hooks and component lifecycle. Learned about advanced TypeScript patterns for React components.',
    nextDayPlans: 'Continue working on the navigation component and implement routing logic.'
  });

  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Logbook entry updated successfully!', {
      description: 'All changes have been saved.'
    });
    router.push(`/dashboard/logbooks/${params.id}`);
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
          <h1 className="text-2xl font-bold text-foreground">Edit Logbook Entry</h1>
          <p className="text-sm text-muted-foreground">Update logbook entry details</p>
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
              <CardDescription>Update the logbook entry information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Entry Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Daily Activities *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
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
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="learnings">Key Learnings</Label>
                <Textarea
                  id="learnings"
                  value={formData.learnings}
                  onChange={(e) => handleInputChange('learnings', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextDayPlans">Plans for Next Day</Label>
                <Textarea
                  id="nextDayPlans"
                  value={formData.nextDayPlans}
                  onChange={(e) => handleInputChange('nextDayPlans', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Tasks Completed */}
          <Card>
            <CardHeader>
              <CardTitle>Tasks Completed</CardTitle>
              <CardDescription>Update the list of completed tasks</CardDescription>
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
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Update Entry
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditLogbookPage;