'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

import { toast } from 'sonner';
import { ArrowLeft, Save, Plus, X, GraduationCap } from 'lucide-react';

const categories = ['Technology', 'Design', 'Marketing', 'Business', 'Engineering', 'Healthcare'];

export default function EditSpecialtyClientView({ id }: { id: string }) {
    const router = useRouter();

    const [formData, setFormData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [newSkill, setNewSkill] = useState('');
    const [newCompany, setNewCompany] = useState('');

    useEffect(() => {
        const fetchSpecialty = async () => {
            try {
                const res = await apiFetch(`/specialties/${id}`);
                setFormData({
                    name: res.data.name,
                    description: res.data.description,
                    category: res.data.category,
                    status: res.data.status,
                    skills: res.data.skills || [],
                    companies: res.data.partner_companies || [],
                    requirements: res.data.requirements || '',
                });
            } catch (err: any) {
                toast.error('Failed to fetch specialty', {
                    description: err.message,
                });
            } finally {
                setLoading(false);
            }
        };
        fetchSpecialty();
    }, [id]);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiFetch(`/specialties/${id}/edit`, {
                method: 'PUT',
                body: JSON.stringify({
                    ...formData,
                    partner_companies: formData.companies, // backend expects this field
                }),
            });
            toast.success('Specialty updated successfully!');
            router.push(`/dashboard/specialties/${id}`);
        } catch (err: any) {
            toast.error('Update failed', {
                description: err.message,
            });
        }
    };

    const addItem = (field: 'skills' | 'companies', value: string) => {
        if (!value.trim()) return;
        setFormData((prev: any) => ({
            ...prev,
            [field]: [...prev[field], value.trim()],
        }));
        field === 'skills' ? setNewSkill('') : setNewCompany('');
    };

    const removeItem = (field: 'skills' | 'companies', value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [field]: prev[field].filter((item: string) => item !== value),
        }));
    };

    if (loading || !formData) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-2">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 opacity-80" />
                <p className="text-sm text-muted-foreground">Loading specialty data...</p>
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
                    <h1 className="text-2xl font-bold text-foreground">Edit Specialty</h1>
                    <p className="text-sm text-muted-foreground">Update specialty information</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Basic Info */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <GraduationCap className="w-5 h-5 mr-2" />
                                Basic Information
                            </CardTitle>
                            <CardDescription>Update the specialty details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Label>Name *</Label>
                            <Input value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />

                            <Label>Category *</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <Label>Status *</Label>
                            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>

                            <Label>Description *</Label>
                            <Textarea rows={4} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} required />

                            <Label>Requirements</Label>
                            <Textarea rows={3} value={formData.requirements} onChange={(e) => handleInputChange('requirements', e.target.value)} />
                        </CardContent>
                    </Card>

                    {/* Skills and Companies */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Skills & Companies</CardTitle>
                            <CardDescription>Add or remove related items</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Label>Skills</Label>
                            <div className="flex space-x-2">
                                <Input
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Add skill"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('skills', newSkill))}
                                />
                                <Button type="button" onClick={() => addItem('skills', newSkill)} size="sm">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                        {skill}
                                        <button type="button" onClick={() => removeItem('skills', skill)} className="ml-1">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>

                            <Label>Partner Companies</Label>
                            <div className="flex space-x-2">
                                <Input
                                    value={newCompany}
                                    onChange={(e) => setNewCompany(e.target.value)}
                                    placeholder="Add company"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('companies', newCompany))}
                                />
                                <Button type="button" onClick={() => addItem('companies', newCompany)} size="sm">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.companies.map((company: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                        {company}
                                        <button type="button" onClick={() => removeItem('companies', company)} className="ml-1">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        <Save className="w-4 h-4 mr-2" />
                        Update Specialty
                    </Button>
                </div>
            </form>
        </div>
    );
}
