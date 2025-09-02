import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem, type IsoManual, type PaginatedResponse } from '@/types';
import { Plus, Search, FileText, Calendar, User } from 'lucide-react';
import axios from '@/lib/axios';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'ISO Manuals', href: '/iso-manuals' },
];

const statusColors = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300',
    archived: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-300',
};

export default function Index() {
    const [manuals, setManuals] = useState<PaginatedResponse<IsoManual> | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');

    const fetchManuals = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (statusFilter) params.append('status', statusFilter);
            
            const response = await axios.get(`/api/manuals?${params.toString()}`);
            setManuals(response.data);
        } catch (error) {
            console.error('Failed to fetch manuals:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManuals();
    }, [searchTerm, statusFilter]);

    const handleCreateManual = () => {
        router.visit('/iso-manuals/create');
    };

    const handleViewManual = (manual: IsoManual) => {
        router.visit(`/iso-manuals/${manual.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ISO Manuals" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">ISO Manuals</h1>
                        <p className="text-muted-foreground">
                            Manage and maintain your ISO compliance documentation
                        </p>
                    </div>
                    <Button onClick={handleCreateManual} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Manual
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search manuals..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Statuses</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="review">Under Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Manuals Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        // Loading skeletons
                        Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardHeader className="space-y-2">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-3 bg-muted rounded w-1/2"></div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="h-3 bg-muted rounded"></div>
                                    <div className="h-3 bg-muted rounded w-2/3"></div>
                                </CardContent>
                            </Card>
                        ))
                    ) : manuals?.data.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No manuals found</h3>
                            <p className="text-muted-foreground">
                                {searchTerm || statusFilter 
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Get started by creating your first ISO manual'
                                }
                            </p>
                            {!searchTerm && !statusFilter && (
                                <Button onClick={handleCreateManual} className="mt-4 gap-2">
                                    <Plus className="h-4 w-4" />
                                    Create Manual
                                </Button>
                            )}
                        </div>
                    ) : (
                        manuals?.data.map((manual) => (
                            <Card 
                                key={manual.id} 
                                className="cursor-pointer transition-all hover:shadow-md"
                                onClick={() => handleViewManual(manual)}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 flex-1">
                                            <CardTitle className="text-lg line-clamp-2">
                                                {manual.title}
                                            </CardTitle>
                                            {manual.iso_standard && (
                                                <CardDescription className="font-medium">
                                                    {manual.iso_standard}
                                                </CardDescription>
                                            )}
                                        </div>
                                        <Badge className={statusColors[manual.status]}>
                                            {manual.status.charAt(0).toUpperCase() + manual.status.slice(1)}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {manual.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-3">
                                            {manual.description}
                                        </p>
                                    )}
                                    
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            <span>{manual.creator?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>v{manual.version}</span>
                                        </div>
                                    </div>
                                    
                                    {manual.sections && manual.sections.length > 0 && (
                                        <div className="text-xs text-muted-foreground">
                                            {manual.sections.length} section{manual.sections.length !== 1 ? 's' : ''}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {manuals && manuals.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <Button 
                            variant="outline" 
                            size="sm"
                            disabled={manuals.current_page === 1}
                            onClick={() => {
                                // Implement pagination logic
                            }}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                            Page {manuals.current_page} of {manuals.last_page}
                        </span>
                        <Button 
                            variant="outline" 
                            size="sm"
                            disabled={manuals.current_page === manuals.last_page}
                            onClick={() => {
                                // Implement pagination logic
                            }}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}