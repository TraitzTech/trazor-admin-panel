'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  MapPin,
  Building,
  GraduationCap,
  Users,
  Shield,
  Loader2,
  Key,
  Search,
  Check,
  ChevronDown,
  X
} from 'lucide-react';
import { apiFetch } from '@/lib/api';

const CreateUserPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [specialtyLoading, setSpecialtyLoading] = useState(false);
  const specialtyDropdownRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    location: '',
    bio: '',
    // Intern specific
    specialty_id: '',
    institution: '',
    hort_number: '',
    start_date: '',
    end_date: '',
    // Admin specific
    permissions: []
  });

  // Fetch specialties on component mount
  useEffect(() => {
    const fetchSpecialties = async () => {
      setSpecialtyLoading(true);
      try {
        const response = await apiFetch('/admin/specialties');
        if (response.success) {
          setSpecialties(response.data);
          setFilteredSpecialties(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch specialties:', err);
        toast.error('Failed to load specialties');
      } finally {
        setSpecialtyLoading(false);
      }
    };
    fetchSpecialties();
  }, []);

  // Filter specialties based on search
  useEffect(() => {
    if (!specialtySearch.trim()) {
      setFilteredSpecialties(specialties);
    } else {
      const filtered = specialties.filter(specialty =>
          specialty.name.toLowerCase().includes(specialtySearch.toLowerCase())
      );
      setFilteredSpecialties(filtered);
    }
  }, [specialtySearch, specialties]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (specialtyDropdownRef.current && !specialtyDropdownRef.current.contains(event.target)) {
        setShowSpecialtyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Role-specific validation
    if (formData.role === 'intern') {
      if (!formData.specialty_id || !formData.institution || !formData.hort_number || !formData.start_date || !formData.end_date) {
        toast.error('Please fill in all intern-specific fields');
        return;
      }

      // Validate date range
      if (new Date(formData.start_date) >= new Date(formData.end_date)) {
        toast.error('End date must be after start date');
        return;
      }
    }

    if (formData.role === 'supervisor' && !formData.specialty_id) {
      toast.error('Please select a specialty for the supervisor');
      return;
    }

    setLoading(true);

    try {
      // Prepare the data to send
      const submitData = {
        ...formData,
        // Ensure specialty_id is sent as integer if it exists
        specialty_id: formData.specialty_id ? parseInt(formData.specialty_id) : null,
        // Clean up empty fields
        phone: formData.phone.trim() || null,
        location: formData.location.trim() || null,
        bio: formData.bio.trim() || null,
      };

      const response = await apiFetch('/admin/users', {
        method: 'POST',
        body: JSON.stringify(submitData),
      });

      if (response.success) {
        toast.success(response.message || 'User created successfully');

        // Show additional success messages for interns
        if (formData.role === 'intern' && response.data?.matric_number) {
          toast.success(`Matriculation number generated: ${response.data.matric_number}`);
        }

        toast.success('Login credentials have been sent to the user\'s email address');

        // Navigate back to users list
        router.push('/dashboard/users');
      } else {
        toast.error(response.message || 'Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      toast.error(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear specialty when role changes
    if (field === 'role' && value !== 'intern' && value !== 'supervisor') {
      setFormData(prev => ({ ...prev, specialty_id: '' }));
    }
  };

  const handleSpecialtySelect = (specialty) => {
    handleInputChange('specialty_id', specialty.id.toString());
    setSpecialtySearch('');
    setShowSpecialtyDropdown(false);
  };

  const handleSpecialtyInputFocus = () => {
    setShowSpecialtyDropdown(true);
  };

  const clearSpecialtySelection = () => {
    handleInputChange('specialty_id', '');
    setSpecialtySearch('');
    setShowSpecialtyDropdown(false);
  };
  const handlePermissionChange = (permission, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permission]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permission)
      }));
    }
  };

  // Custom Specialty Selector Component
  const SpecialtySelector = () => {
    const selectedSpecialty = specialties.find(s => s.id.toString() === formData.specialty_id.toString());

    return (
        <div className="space-y-2">
          <Label htmlFor="specialty_search">Specialty *</Label>
          <div className="relative" ref={specialtyDropdownRef}>
            {/* Display selected specialty or search input */}
            {selectedSpecialty && !showSpecialtyDropdown ? (
                <div className="flex items-center justify-between p-3 border border-input bg-background rounded-md cursor-pointer hover:bg-accent transition-colors"
                     onClick={() => setShowSpecialtyDropdown(true)}>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">{selectedSpecialty.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearSpecialtySelection();
                        }}
                        className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
            ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                      id="specialty_search"
                      value={specialtySearch}
                      onChange={(e) => setSpecialtySearch(e.target.value)}
                      onFocus={handleSpecialtyInputFocus}
                      placeholder="Search specialties..."
                      className="pl-10 pr-10"
                  />
                  {specialtySearch && (
                      <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSpecialtySearch('')}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                  )}
                </div>
            )}

            {/* Dropdown */}
            {showSpecialtyDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-hidden">
                  {specialtyLoading ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        <span className="text-sm text-muted-foreground">Loading specialties...</span>
                      </div>
                  ) : filteredSpecialties.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto">
                        {filteredSpecialties.map((specialty) => (
                            <div
                                key={specialty.id}
                                onClick={() => handleSpecialtySelect(specialty)}
                                className="flex items-center justify-between p-3 hover:bg-accent cursor-pointer transition-colors border-b border-border last:border-b-0"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div>
                                  <p className="text-sm font-medium">{specialty.name}</p>
                                  {specialty.description && (
                                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs">
                                        {specialty.description}
                                      </p>
                                  )}
                                </div>
                              </div>
                              {formData.specialty_id === specialty.id.toString() && (
                                  <Check className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                        ))}
                      </div>
                  ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          {specialtySearch ? `No specialties found for "${specialtySearch}"` : 'No specialties available'}
                        </p>
                        {specialtySearch && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setSpecialtySearch('')}
                                className="mt-2"
                            >
                              Clear search
                            </Button>
                        )}
                      </div>
                  )}
                </div>
            )}
          </div>

          {/* Specialty count indicator */}
          {specialties.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {filteredSpecialties.length} of {specialties.length} specialties
                {specialtySearch && ` matching "${specialtySearch}"`}
              </p>
          )}
        </div>
    );
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get selected specialty name for display
  const getSelectedSpecialtyName = () => {
    if (!formData.specialty_id) return null;
    const specialty = specialties.find(s => s.id.toString() === formData.specialty_id.toString());
    return specialty?.name || 'Select specialty';
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
            <h1 className="text-2xl font-bold text-foreground">Create New User</h1>
            <p className="text-sm text-muted-foreground">Add a new user to the platform</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>Enter the user's basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter full name"
                        required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address"
                        required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">User Role *</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intern">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Intern
                          </div>
                        </SelectItem>
                        <SelectItem value="supervisor">
                          <div className="flex items-center">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Supervisor
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            Admin
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Enter location"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Enter user bio"
                      rows={3}
                  />
                </div>

                {/* Password Information Notice */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-700">
                  <div className="flex items-start space-x-3">
                    <Key className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Automatic Password Generation
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        A secure password will be automatically generated and sent to the user's email address along with their login credentials.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role-specific Information */}
            <Card>
              <CardHeader>
                <CardTitle>Role-specific Details</CardTitle>
                <CardDescription>Additional information based on user role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(formData.role === 'intern' || formData.role === 'supervisor') && (
                    <SpecialtySelector />
                )}

                {formData.role === 'intern' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution *</Label>
                        <Input
                            id="institution"
                            value={formData.institution}
                            onChange={(e) => handleInputChange('institution', e.target.value)}
                            placeholder="Enter institution name"
                            required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hort_number">Hort Number *</Label>
                        <Input
                            id="hort_number"
                            value={formData.hort_number}
                            onChange={(e) => handleInputChange('hort_number', e.target.value.toUpperCase())}
                            placeholder="Enter hort number"
                            required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="start_date">Start Date *</Label>
                          <Input
                              id="start_date"
                              type="date"
                              value={formData.start_date}
                              onChange={(e) => handleInputChange('start_date', e.target.value)}
                              min={getTodayDate()}
                              required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end_date">End Date *</Label>
                          <Input
                              id="end_date"
                              type="date"
                              value={formData.end_date}
                              onChange={(e) => handleInputChange('end_date', e.target.value)}
                              min={formData.start_date || getTodayDate()}
                              required
                          />
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Note:</strong> A matriculation number will be automatically generated based on the specialty and hort number.
                        </p>
                      </div>
                    </>
                )}

                {formData.role === 'admin' && (
                    <div className="space-y-4">
                      <Label>Admin Permissions</Label>
                      <div className="space-y-3">
                        {[
                          { key: 'user_management', label: 'User Management' },
                          { key: 'content_moderation', label: 'Content Moderation' },
                          { key: 'analytics', label: 'Analytics' },
                          { key: 'system_settings', label: 'System Settings' }
                        ].map((permission) => (
                            <div key={permission.key} className="flex items-center space-x-2">
                              <Switch
                                  id={permission.key}
                                  checked={formData.permissions.includes(permission.key)}
                                  onCheckedChange={(checked) => handlePermissionChange(permission.key, checked)}
                              />
                              <Label htmlFor={permission.key} className="text-sm font-medium">
                                {permission.label}
                              </Label>
                            </div>
                        ))}
                      </div>
                    </div>
                )}

                {!formData.role && (
                    <div className="text-center py-8 text-muted-foreground">
                      <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Select a role to see additional fields</p>
                    </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
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
                    Create User
                  </>
              )}
            </Button>
          </div>
        </form>
      </div>
  );
};

export default CreateUserPage;