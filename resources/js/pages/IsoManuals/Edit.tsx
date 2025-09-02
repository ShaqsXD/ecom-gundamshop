import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type BreadcrumbItem, type IsoManual, type ManualSection } from '@/types';
import { Save, ArrowLeft, Plus, FileText, Settings } from 'lucide-react';
import axios from '@/lib/axios';

interface Props {
    manualId: string;
}

interface FormData {
    title: string;
    iso_standard: string;
    description: string;
    version: string;
    effective_date: string;
    review_date: string;
}

export default function Edit({ manualId }: Props) {
    const [manual, setManual] = useState<IsoManual | null>(null);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        iso_standard: '',
        description: '',
        version: '',
        effective_date: '',
        review_date: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'ISO Manuals', href: '/iso-manuals' },
        { title: manual?.title || 'Loading...', href: `/iso-manuals/${manualId}` },
        { title: 'Edit', href: `/iso-manuals/${manualId}/edit` },
    ];

    const fetchManual = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/manuals/${manualId}`);
            const manualData = response.data;
            setManual(manualData);
            
            setFormData({
                title: manualData.title || '',
                iso_standard: manualData.iso_standard || '',
                description: manualData.description || '',
                version: manualData.version || '',
                effective_date: manualData.effective_date || '',
                review_date: manualData.review_date || '',
            });
        } catch (error) {
            console.error('Failed to fetch manual:', error);
            router.visit('/iso-manuals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManual();
    }, [manualId]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        try {
            const response = await axios.put(`/api/manuals/${manualId}`, formData);
            setManual(response.data);
            router.visit(`/iso-manuals/${manualId}`);
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Failed to update manual:', error);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        router.visit(`/iso-manuals/${manualId}`);
    };

    const handleAddSection = () => {
        // TODO: Implement section creation modal
        console.log('Add section clicked');
    };

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Loading..." />
                <div className="flex h-full flex-1 items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </AppLayout>
        );
    }

    if (!manual) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Manual Not Found" />
                <div className="flex h-full flex-1 items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">Manual not found</h2>
                        <Button onClick={() => router.visit('/iso-manuals')} className="mt-4">
                            Back to Manuals
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${manual.title}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={handleCancel}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">Edit Manual</h1>
                        <p className="text-muted-foreground">
                            Modify manual information and manage sections
                        </p>
                    </div>
                    <Badge className={`${
                        manual.status === 'approved' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300'
                            : manual.status === 'review'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                        {manual.status.charAt(0).toUpperCase() + manual.status.slice(1)}
                    </Badge>
                </div>

                <Tabs defaultValue="details" className="flex-1">
                    <TabsList>
                        <TabsTrigger value="details" className="gap-2">
                            <Settings className="h-4 w-4" />
                            Details
                        </TabsTrigger>
                        <TabsTrigger value="sections" className="gap-2">
                            <FileText className="h-4 w-4" />
                            Sections
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Manual Information</CardTitle>
                                <CardDescription>
                                    Update the basic information for this ISO manual
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title *</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange('title', e.target.value)}
                                            className={errors.title ? 'border-red-500' : ''}
                                        />
                                        {errors.title && (
                                            <p className="text-sm text-red-500">{errors.title}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="iso_standard">ISO Standard</Label>
                                        <Input
                                            id="iso_standard"
                                            value={formData.iso_standard}
                                            onChange={(e) => handleInputChange('iso_standard', e.target.value)}
                                            placeholder="e.g., ISO 9001:2015"
                                            className={errors.iso_standard ? 'border-red-500' : ''}
                                        />
                                        {errors.iso_standard && (
                                            <p className="text-sm text-red-500">{errors.iso_standard}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            rows={4}
                                            className={errors.description ? 'border-red-500' : ''}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-500">{errors.description}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="version">Version</Label>
                                            <Input
                                                id="version"
                                                value={formData.version}
                                                onChange={(e) => handleInputChange('version', e.target.value)}
                                                className={errors.version ? 'border-red-500' : ''}
                                            />
                                            {errors.version && (
                                                <p className="text-sm text-red-500">{errors.version}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="effective_date">Effective Date</Label>
                                            <Input
                                                id="effective_date"
                                                type="date"
                                                value={formData.effective_date}
                                                onChange={(e) => handleInputChange('effective_date', e.target.value)}
                                                className={errors.effective_date ? 'border-red-500' : ''}
                                            />
                                            {errors.effective_date && (
                                                <p className="text-sm text-red-500">{errors.effective_date}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="review_date">Review Date</Label>
                                            <Input
                                                id="review_date"
                                                type="date"
                                                value={formData.review_date}
                                                onChange={(e) => handleInputChange('review_date', e.target.value)}
                                                className={errors.review_date ? 'border-red-500' : ''}
                                            />
                                            {errors.review_date && (
                                                <p className="text-sm text-red-500">{errors.review_date}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button type="submit" disabled={saving} className="gap-2">
                                            <Save className="h-4 w-4" />
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="sections" className="mt-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Manual Sections</CardTitle>
                                        <CardDescription>
                                            Manage the structure and content of your manual
                                        </CardDescription>
                                    </div>
                                    <Button onClick={handleAddSection} className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Section
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {manual.sections && manual.sections.length > 0 ? (
                                    <div className="space-y-4">
                                        {manual.sections.map((section) => (
                                            <div key={section.id} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium">
                                                            {section.section_number} {section.title}
                                                        </h4>
                                                        <p className="text-sm text-muted-foreground">
                                                            {section.section_type} • {section.is_required ? 'Required' : 'Optional'}
                                                        </p>
                                                    </div>
                                                    <Button variant="outline" size="sm">
                                                        Edit
                                                    </Button>
                                                </div>
                                                {section.content && (
                                                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                                        {section.content}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <FileText className="mx-auto h-8 w-8 mb-2" />
                                        <p>No sections added yet</p>
                                        <Button variant="outline" onClick={handleAddSection} className="mt-2 gap-2">
                                            <Plus className="h-4 w-4" />
                                            Add First Section
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}