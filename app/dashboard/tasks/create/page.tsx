'use client';

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {ArrowLeft, Save, Plus, X, Target, Calendar, Users, Flag, Loader2} from 'lucide-react';
import { apiFetch } from "@/lib/api";

const CreateTaskPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        status: 'pending',
        priority: 'medium',
        specialtyId: '',
        assignedInterns: [] as string[],
    });

    const [newIntern, setNewIntern] = useState('');
    const [loading, setLoading] = useState(false);

    const [specialties, setSpecialties] = useState<{ id: string; name: string }[]>([]);
    const [interns, setInterns] = useState<{ id: string; name: string; specialty: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [specialtiesData, internsData] = await Promise.all([
                    apiFetch('/specialties'),
                    apiFetch('/admin/interns'),
                ]);

                setSpecialties(Array.isArray(specialtiesData.data) ? specialtiesData.data : []);
                setInterns(Array.isArray(internsData.data) ? internsData.data : []);
            } catch (err) {
                toast.error('Failed to fetch required data');
                console.error('Error fetching form data:', err);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await apiFetch('/tasks', {
                method: 'POST',
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    due_date: formData.dueDate,
                    status: formData.status,
                    priority: formData.priority,
                    specialty_id: formData.specialtyId || null,
                    intern_ids: formData.assignedInterns,
                }),
            });

            if (response.success) {
                toast.success('Task created successfully!');
                router.push('/dashboard/tasks');
            } else {
                throw new Error(response.message || 'Failed to create task');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to create task');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addIntern = () => {
        if (newIntern.trim() && !formData.assignedInterns.includes(newIntern.trim())) {
            setFormData(prev => ({
                ...prev,
                assignedInterns: [...prev.assignedInterns, newIntern.trim()]
            }));
            setNewIntern('');
            toast.success('Intern added');
        }
    };

    const removeIntern = (internId: string) => {
        setFormData(prev => ({
            ...prev,
            assignedInterns: prev.assignedInterns.filter(id => id !== internId)
        }));
        toast.info('Intern removed');
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
                    <h1 className="text-2xl font-bold text-foreground">Create New Task</h1>
                    <p className="text-sm text-muted-foreground">Assign a new task to interns</p>
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
                            <CardDescription>Fill in the task information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="e.g., Implement user authentication"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Describe the task in detail..."
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="dueDate">Due Date</Label>
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleInputChange('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="done">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(value) => handleInputChange('priority', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="specialty">Specialty</Label>
                                    <Select
                                        value={formData.specialtyId}
                                        onValueChange={(value) => handleInputChange('specialtyId', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select specialty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {specialties.map((specialty) => (
                                                <SelectItem key={specialty.id} value={specialty.id}>
                                                    {specialty.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* Intern Assignment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="w-5 h-5 mr-2" />
                                Assign Interns
                            </CardTitle>
                            <CardDescription>Select interns to assign this task to</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Add Intern</Label>
                                <div className="flex space-x-2">
                                    <Select
                                        value={newIntern}
                                        onValueChange={setNewIntern}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select intern" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {interns.map((intern) => (
                                                <SelectItem key={intern.id} value={intern.id}>
                                                    {intern.name} ({intern.specialty})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        type="button"
                                        onClick={addIntern}
                                        size="sm"
                                        disabled={!newIntern}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Assigned Interns ({formData.assignedInterns.length})</Label>
                                <div className="space-y-2 max-h-64 overflow-y-auto thin-scrollbar">
                                    {formData.assignedInterns.map((internId) => {
                                        const intern = interns.find(i => i.id === internId);
                                        return (
                                            <div key={internId} className="flex items-start space-x-2 p-2 bg-muted/50 rounded">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{intern?.name || 'Unknown Intern'}</p>
                                                    <p className="text-xs text-muted-foreground">{intern?.specialty}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeIntern(internId)}
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {formData.assignedInterns.length === 0 && (
                                        <p className="text-sm text-muted-foreground text-center py-4">
                                            No interns assigned yet
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
                    <Button type="submit" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Create Task
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateTaskPage;