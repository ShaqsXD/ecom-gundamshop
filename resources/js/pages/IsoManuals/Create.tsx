import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { Save, ArrowLeft } from 'lucide-react';
import axios from '@/lib/axios';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'ISO Manuals', href: '/iso-manuals' },
    { title: 'Create Manual', href: '/iso-manuals/create' },
];

interface FormData {
    title: string;
    iso_standard: string;
    description: string;
    version: string;
    effective_date: string;
    review_date: string;
}

export default function Create() {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        iso_standard: '',
        description: '',
        version: '1.0',
        effective_date: '',
        review_date: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await axios.post('/api/manuals', formData);
            router.visit(`/iso-manuals/${response.data.id}`);
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Failed to create manual:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.visit('/iso-manuals');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create ISO Manual" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={handleCancel}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create ISO Manual</h1>
                        <p className="text-muted-foreground">
                            Create a new ISO compliance manual
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manual Information</CardTitle>
                            <CardDescription>
                                Enter the basic information for your ISO manual
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
                                        placeholder="e.g., Quality Management System Manual"
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
                                        placeholder="Brief description of the manual's purpose and scope"
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
                                            placeholder="1.0"
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
                                    <Button type="submit" disabled={loading} className="gap-2">
                                        <Save className="h-4 w-4" />
                                        {loading ? 'Creating...' : 'Create Manual'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}