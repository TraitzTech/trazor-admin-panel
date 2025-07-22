'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Save, Plus, X, GraduationCap } from 'lucide-react';
import { apiFetch } from '@/lib/api'; // make sure this is correctly configured to call Laravel API

const CreateSpecialtyPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    status: 'active',
    skills: [],
    companies: [],
    requirements: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Technology', 'Design', 'Marketing', 'Business', 'Engineering', 'Healthcare'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
      toast.success('Skill added', {
        description: `${newSkill.trim()} has been added to the specialty skills.`
      });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
    toast.info('Skill removed');
  };

  const addCompany = () => {
    if (newCompany.trim() && !formData.companies.includes(newCompany.trim())) {
      setFormData(prev => ({
        ...prev,
        companies: [...prev.companies, newCompany.trim()]
      }));
      setNewCompany('');
      toast.success('Company added', {
        description: `${newCompany.trim()} has been added as a partner company.`
      });
    }
  };

  const removeCompany = (companyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      companies: prev.companies.filter(company => company !== companyToRemove)
    }));
    toast.info('Company removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createSpecialty(formData);

      toast.success('Specialty created successfully!', {
        description: `The specialty "${response.data.name}" has been added.`,
      });

      router.push('/dashboard/specialties');
    } catch (error: any) {
      const msg = error?.message || 'Failed to create specialty.';
      toast.error('Error creating specialty', {
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-2xl font-bold text-foreground">Create New Specialty</h1>
          <p className="text-sm text-muted-foreground">Add a new internship specialty to the platform</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
              <CardDescription>Enter the specialty details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Specialty Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Software Development"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the specialty and what it encompasses..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="List the general requirements for this specialty..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills and Companies */}
          <Card>
            <CardHeader>
              <CardTitle>Skills & Partners</CardTitle>
              <CardDescription>Define skills and partner companies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Required Skills</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Partner Companies</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="Add a company"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompany())}
                  />
                  <Button type="button" onClick={addCompany} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.companies.map((company, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {company}
                      <button
                        type="button"
                        onClick={() => removeCompany(company)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
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
            Create Specialty
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSpecialtyPage;

// ✅ Reusable function
async function createSpecialty(formData: any) {
  const res = await apiFetch('/admin/specialties/create', {
    method: 'POST',
    body: JSON.stringify({
      name: formData.name,
      description: formData.description,
      category: formData.category,
      status: formData.status,
      requirements: formData.requirements,
      skills: formData.skills,
      partner_companies: formData.companies,
    }),
  });

  return res;
}