'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Loader2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Eye,
  Users,
  GraduationCap,
  UserCheck,
  Building,
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";



const SpecialtiesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const router = useRouter();

  const [specialties, setSpecialties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [totalInterns, setTotalInterns] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [specialtyToDelete, setSpecialtyToDelete] = useState<any | null>(null);


  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const response = await apiFetch('/specialties');

        // Fix: Access the correct property from API response
        setSpecialties(response.data || []); // Use 'data' instead of 'specialties'

        // Calculate total interns from the specialties data
        const totalInternsCount = response.data?.reduce((sum, specialty) => {
          return sum + (Array.isArray(specialty.interns) ? specialty.interns.length : 0);
        }, 0) || 0;

        setTotalInterns(totalInternsCount);

      } catch (error) {
        toast.error('Failed to load specialties', {
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);


  const filteredSpecialties = specialties.filter(specialty => {
    const matchesSearch = specialty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         specialty.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         specialty.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || specialty.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const specialtyStats = {
    total: specialties.length,
    active: specialties.filter(s => s.status === 'active').length,
    inactive: specialties.filter(s => s.status === 'inactive').length,
    totalInterns: specialties.reduce((sum, s) => sum + (Array.isArray(s.interns) ? s.interns.length : 0), 0),
    totalSupervisors: specialties.reduce((sum, s) => sum + (Array.isArray(s.supervisors) ? s.supervisors.length : 0), 0),
    // Note: averageRating doesn't exist in my API response, so this will be NaN
    avgRating: specialties.length > 0 ?
        (specialties.reduce((sum, s) => sum + (s.averageRating || 0), 0) / specialties.length).toFixed(1) :
        '0.0'
  };

  const categories = ['Technology', 'Design', 'Marketing', 'Business'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technology': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'Design': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'Marketing': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      case 'Business': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleCreateSpecialty = () => {
    router.push('/dashboard/specialties/create');
  };

  const handleViewSpecialty = (id: number) => {
    router.push(`/dashboard/specialties/${id}`);
  };

  const handleEditSpecialty = (id: number) => {
    router.push(`/dashboard/specialties/${id}/edit`);
  };

  const handleToggleStatus = (specialty: any) => {
    const newStatus = specialty.status === 'active' ? 'inactive' : 'active';
    toast.success(`Specialty ${newStatus}`, {
      description: `${specialty.name} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`
    });
  };

  if (loading) {
    return (
        <div className="p-6 h-64 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Loading specialties...</p>
        </div>
    );
  }


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Specialty Management</h1>
          <p className="text-sm text-muted-foreground">Manage internship specialties and their requirements</p>
        </div>
        <Button onClick={handleCreateSpecialty}>
          <Plus className="w-4 h-4 mr-2" />
          Add Specialty
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{specialtyStats.total}</p>
              <p className="text-sm text-muted-foreground">Total Specialties</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{specialtyStats.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{specialtyStats.inactive}</p>
              <p className="text-sm text-muted-foreground">Inactive</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{totalInterns}</p>
              <p className="text-sm text-muted-foreground">Total Interns</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{specialtyStats.totalSupervisors}</p>
              <p className="text-sm text-muted-foreground">Supervisors</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{specialtyStats.avgRating}</p>
              <p className="text-sm text-muted-foreground">Avg Rating</p>
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
                  placeholder="Search specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
                <TabsList>
                  <TabsTrigger value="all">All Specialties</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecialties.map((specialty) => (
              <Card key={specialty.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-foreground">{specialty.name}</h3>
                        <Badge className={getStatusColor(specialty.status)}>
                          {specialty.status}
                        </Badge>
                      </div>
                      <Badge className={getCategoryColor(specialty.category)} variant="outline">
                        {specialty.category}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditSpecialty(specialty.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setSpecialtyToDelete(specialty);
                              setShowDeleteModal(true);
                            }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{specialty.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2 text-blue-500" />
                      <span>{Array.isArray(specialty.interns) ? specialty.interns.length : 0} interns</span>
                    </div>
                    <div className="flex items-center">
                      <UserCheck className="w-4 h-4 mr-2 text-green-500" />
                      <span>{Array.isArray(specialty.supervisors) ? specialty.supervisors.length : 0} supervisors</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2 text-yellow-500" />
                      <span>{specialty.averageRating || 'N/A'} rating</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
                      <span>{specialty.completionRate || 'N/A'}% completion</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Partner Companies:</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(specialty.partner_companies) && specialty.partner_companies.length > 0 ? (
                          <>
                            {specialty.partner_companies.slice(0, 3).map((company, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Building className="w-3 h-3 mr-1" />
                                  {company}
                                </Badge>
                            ))}
                            {specialty.partner_companies.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{specialty.partner_companies.length - 3} more
                                </Badge>
                            )}
                          </>
                      ) : (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            No partner companies
                          </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {specialty?.skills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                      {specialty.skills?.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{specialty.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewSpecialty(specialty.id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditSpecialty(specialty.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      {specialtyToDelete && (
          <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete “{specialtyToDelete.name}”?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSpecialtyToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={async () => {
                      try {
                        await apiFetch(`/specialties/${specialtyToDelete.id}`, {
                          method: 'DELETE'
                        });
                        toast.success('Specialty deleted successfully.');
                        setSpecialties(prev => prev.filter(s => s.id !== specialtyToDelete.id));
                      } catch (err: any) {
                        toast.error('Failed to delete specialty.', {
                          description: err.message
                        });
                      } finally {
                        setShowDeleteModal(false);
                        setSpecialtyToDelete(null);
                      }
                    }}
                >
                  Yes, Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      )}

    </div>
  );
};

export default SpecialtiesPage;