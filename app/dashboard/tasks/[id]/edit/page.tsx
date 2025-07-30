'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import {
    ArrowLeft,
    Save,
    Target,
    Calendar,
    Flag,
    Settings,
    Users,
    FileText,
    Loader2,
    X,
    Plus,
    User
} from 'lucide-react';

const EditTaskPage = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [specialties, setSpecialties] = useState([]);
    const [interns, setInterns] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'pending',
        due_date: '',
        specialty_id: '',
        assigned_interns: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch all data in parallel
                const [taskResponse, specialtiesResponse, internsResponse] = await Promise.all([
                    apiFetch(`/tasks/${params.id}`),
                    apiFetch('/specialties'),
                    apiFetch('/admin/interns')
                ]);

                // Extract data from responses (handle both direct arrays and { data: [] } formats)
                const taskData = taskResponse.data || taskResponse;
                const specialtiesData = specialtiesResponse.data || specialtiesResponse;
                const internsData = internsResponse.data || internsResponse;

                // Ensure we always have arrays
                const safeSpecialties = Array.isArray(specialtiesData) ? specialtiesData : [];
                const safeInterns = Array.isArray(internsData) ? internsData : [];

                setFormData({
                    title: taskData.title || '',
                    description: taskData.description || '',
                    status: taskData.status || 'pending',
                    due_date: taskData.due_date ? taskData.due_date.split('T')[0] : '',
                    specialty_id: taskData.specialty_id?.toString() || '',
                    assigned_interns: taskData.interns?.map(intern => intern.id) || []
                });

                setSpecialties(safeSpecialties);
                setInterns(safeInterns);
            } catch (error) {
                toast.error('Failed to load task data');
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Task title is required');
            return;
        }

        setSaving(true);
        try {
            await apiFetch(`/tasks/${params.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    ...formData,
                    specialty_id: formData.specialty_id ? parseInt(formData.specialty_id) : null,
                    due_date: formData.due_date || null
                }),
            });

            toast.success('Task updated successfully!', {
                description: 'All changes have been saved.'
            });
            router.push(`/dashboard/tasks/${params.id}`);
        } catch (error) {
            toast.error('Failed to update task');
            console.error('Error updating task:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field: string, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleInternToggle = (internId: number) => {
        setFormData(prev => ({
            ...prev,
            assigned_interns: prev.assigned_interns.includes(internId)
                ? prev.assigned_interns.filter(id => id !== internId)
                : [...prev.assigned_interns, internId]
        }));
    };

    const getInitials = (name?: string) => {
        return name?.split(' ').map(n => n[0]).join('') ?? 'IN';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
            case 'pending': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center text-dark flex justify-center items-center h-64 gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                Loading task details...
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Edit Task</h1>
                    <p className="text-sm text-muted-foreground">Update task details and assignments</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Target className="w-5 h-5 mr-2" />
                                Task Details
                            </CardTitle>
                            <CardDescription>Update the task information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Task Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Enter task title"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Task Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Describe what needs to be accomplished"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="done">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="due_date">Due Date</Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={formData.due_date}
                                        onChange={(e) => handleInputChange('due_date', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specialty">Specialty</Label>
                                <Select value={formData.specialty_id} onValueChange={(value) => handleInputChange('specialty_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a specialty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {specialties.map((specialty) => (
                                            <SelectItem key={specialty.id} value={specialty.id.toString()}>
                                                {specialty.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Task Status Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Current Status:</span>
                                    <Badge className={getStatusColor(formData.status)}>
                                        {formData.status.replace('_', ' ')}
                                    </Badge>
                                </div>
                                {formData.due_date && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Due Date:</span>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(formData.due_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Intern Assignment */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Users className="w-4 h-4 mr-2" />
                                    Assign Interns ({formData.assigned_interns.length})
                                </CardTitle>
                                <CardDescription>Select interns to assign to this task</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {interns.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">No interns available</p>
                                    ) : (
                                        interns.map((intern) => (
                                            <div key={intern.id} className="flex items-center space-x-3">
                                                <Checkbox
                                                    id={`intern-${intern.id}`}
                                                    checked={formData.assigned_interns.includes(intern.id)}
                                                    onCheckedChange={() => handleInternToggle(intern.id)}
                                                />
                                                <div className="flex items-center space-x-2 flex-1">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={intern?.avatar} alt={intern?.name} />
                                                        <AvatarFallback className="text-xs">
                                                            {getInitials(intern?.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">{intern?.name || 'Unknown'}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {intern.specialty || 'No specialty'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Selected Interns Preview */}
                        {formData.assigned_interns.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Selected Interns</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {formData.assigned_interns.map((internId) => {
                                            const intern = interns.find(i => i.id === internId);
                                            if (!intern) return null;

                                            return (
                                                <div key={internId} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar className="h-6 w-6">
                                                            <AvatarImage src={intern?.avatar} alt={intern?.name} />
                                                            <AvatarFallback className="text-xs">
                                                                {getInitials(intern?.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm">{intern?.name}</span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleInternToggle(internId)}
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Task Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-center">
                                    <Settings className="w-4 h-4 mr-3 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Specialty</p>
                                        <p className="text-muted-foreground">
                                            {formData.specialty_id
                                                ? specialties.find(s => s.id.toString() === formData.specialty_id)?.name || 'Unknown'
                                                : 'Not assigned'
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Due Date</p>
                                        <p className="text-muted-foreground">
                                            {formData.due_date
                                                ? new Date(formData.due_date).toLocaleDateString()
                                                : 'No due date set'
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-3 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">Assigned Interns</p>
                                        <p className="text-muted-foreground">
                                            {formData.assigned_interns.length} intern{formData.assigned_interns.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Update Task
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default EditTaskPage;