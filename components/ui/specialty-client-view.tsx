'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Edit,
    GraduationCap,
    Building,
    BookOpen,
    MoreHorizontal, Loader2
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from '@/components/ui/dropdown-menu';

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from '@/components/ui/alert-dialog';


const SpecialtyClientView = ({ id }: { id: string }) => {
    const router = useRouter();
    const [specialty, setSpecialty] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [specialtyToDelete, setSpecialtyToDelete] = useState<any | null>(null);
    const [deleting, setDeleting] = useState(false);


    useEffect(() => {
        const fetchSpecialty = async () => {
            try {
                const res = await apiFetch(`/specialties/${id}`);
                setSpecialty(res.data);
            } catch (err: any) {
                toast.error('Failed to fetch specialty', {
                    description: err.message,
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchSpecialty();
        }
    }, [id]);

    const handleEdit = () => {
        router.push(`/dashboard/specialties/${id}/edit`);
    };

    const handleStatusToggle = () => {
        const newStatus = specialty.status === 'active' ? 'inactive' : 'active';
        toast.success(`Specialty ${newStatus}`, {
            description: `The specialty has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`
        });
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-2">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600 opacity-80" />
                <p className="text-sm text-muted-foreground">Loading specialty data...</p>
            </div>
        );
    }
    if (!specialty) return <div className="p-6 text-red-500">Specialty not found</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Specialty Details</h1>
                        <p className="text-sm text-muted-foreground">View and manage specialty information</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={handleEdit}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <Button variant="outline" onClick={handleStatusToggle}>
                        {specialty.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" aria-label="More actions">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleEdit}>
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <GraduationCap className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <CardTitle>{specialty.name}</CardTitle>
                        <div className="flex justify-center space-x-2">
                            <Badge className={getCategoryColor(specialty.category)}>
                                {specialty.category}
                            </Badge>
                            <Badge variant={specialty.status === 'active' ? 'default' : 'secondary'}>
                                {specialty.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-center text-sm text-muted-foreground">{specialty.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-blue-600">{specialty.interns?.length || 0}</p>
                                <p className="text-sm text-muted-foreground">Total Interns</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-600">{specialty.supervisors?.length || 0}</p>
                                <p className="text-sm text-muted-foreground">Supervisors</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <h4 className="font-medium mb-3">Key Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {(specialty.skills || []).slice(0, 6).map((skill: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        <BookOpen className="w-3 h-3 mr-1" />
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <h4 className="font-medium mb-3">Partner Companies</h4>
                            <div className="flex flex-wrap gap-2">
                                {(specialty.partner_companies || []).slice(0, 4).map((company: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                        <Building className="w-3 h-3 mr-1" />
                                        {company}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardContent className="p-0">
                        <Tabs defaultValue="overview" className="w-full">
                            <div className="px-6 pt-6">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="interns">Interns</TabsTrigger>
                                    <TabsTrigger value="supervisors">Supervisors</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="overview" className="p-6 space-y-4">
                                <h3 className="font-semibold">Requirements</h3>
                                <p className="text-muted-foreground">{specialty.requirements}</p>
                            </TabsContent>

                            <TabsContent value="interns" className="p-6 space-y-4">
                                <h3 className="font-semibold">Interns ({specialty.interns?.length || 0})</h3>
                                {(specialty.interns || []).map((intern: any) => (
                                    <div key={intern.id} className="border rounded-lg p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src="/placeholder-avatar.jpg" />
                                                <AvatarFallback>{intern.user?.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-medium">{intern.user?.name}</h4>
                                                <p className="text-sm text-muted-foreground">{intern.user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="supervisors" className="p-6 space-y-4">
                                <h3 className="font-semibold">Supervisors ({specialty.supervisors?.length || 0})</h3>
                                {(specialty.supervisors || []).map((supervisor: any) => (
                                    <div key={supervisor.id} className="border rounded-lg p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src="/placeholder-avatar.jpg" />
                                                <AvatarFallback>{supervisor.user?.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-medium">{supervisor.user?.name}</h4>
                                                <p className="text-sm text-muted-foreground">{supervisor.user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
            {specialtyToDelete && (
                <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you sure you want to delete the specialty “{specialtyToDelete.name}”?
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setSpecialtyToDelete(null)}>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deleting}
                                onClick={async () => {
                                    setDeleting(true);
                                    try {
                                        await apiFetch(`/specialties/${specialtyToDelete.id}`, {
                                            method: 'DELETE'
                                        });
                                        toast.success('Specialty deleted successfully.');
                                        router.push('/dashboard/specialties'); // Navigate back after delete
                                    } catch (err: any) {
                                        toast.error('Failed to delete specialty.', {
                                            description: err.message,
                                        });
                                    } finally {
                                        setDeleting(false);
                                        setShowDeleteModal(false);
                                        setSpecialtyToDelete(null);
                                    }
                                }}
                            >
                                {deleting ? 'Deleting...' : 'Yes, Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

        </div>
    );
};

export default SpecialtyClientView;
