import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { type BreadcrumbItem, type IsoManual, type ManualSection } from '@/types';
import { 
    ArrowLeft, 
    Edit, 
    Download, 
    FileText, 
    ChevronDown, 
    ChevronRight,
    Calendar,
    User,
    CheckCircle,
    Clock,
    Archive
} from 'lucide-react';
import axios from '@/lib/axios';

interface Props {
    manualId: string;
}

const statusIcons = {
    draft: Clock,
    review: Clock,
    approved: CheckCircle,
    archived: Archive,
};

const statusColors = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300',
    archived: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-300',
};

export default function Show({ manualId }: Props) {
    const [manual, setManual] = useState<IsoManual | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

    const fetchManual = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/manuals/${manualId}`);
            setManual(response.data);
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

    const handleEdit = () => {
        router.visit(`/iso-manuals/${manualId}/edit`);
    };

    const handleBack = () => {
        router.visit('/iso-manuals');
    };

    const toggleSection = (sectionId: number) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionId)) {
                newSet.delete(sectionId);
            } else {
                newSet.add(sectionId);
            }
            return newSet;
        });
    };

    const renderSection = (section: ManualSection, level: number = 0) => {
        const hasChildren = section.child_sections && section.child_sections.length > 0;
        const isExpanded = expandedSections.has(section.id);
        const StatusIcon = statusIcons[manual?.status || 'draft'];

        return (
            <div key={section.id} className={`${level > 0 ? 'ml-6 border-l border-muted pl-4' : ''}`}>
                <Collapsible>
                    <CollapsibleTrigger 
                        className="flex w-full items-center justify-between rounded-lg p-3 hover:bg-muted/50 transition-colors"
                        onClick={() => toggleSection(section.id)}
                    >
                        <div className="flex items-center gap-3">
                            {hasChildren && (
                                isExpanded ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                            )}
                            <div className="text-left">
                                <div className="font-medium">
                                    {section.section_number} {section.title}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {section.section_type} • {section.is_required ? 'Required' : 'Optional'}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {section.procedures && section.procedures.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                    {section.procedures.length} procedure{section.procedures.length !== 1 ? 's' : ''}
                                </Badge>
                            )}
                            {section.documents && section.documents.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                    {section.documents.length} document{section.documents.length !== 1 ? 's' : ''}
                                </Badge>
                            )}
                        </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                        {section.content && (
                            <div className="p-3 text-sm text-muted-foreground whitespace-pre-wrap">
                                {section.content}
                            </div>
                        )}
                        
                        {/* Render child sections */}
                        {hasChildren && (
                            <div className="space-y-2">
                                {section.child_sections!.map(childSection => 
                                    renderSection(childSection, level + 1)
                                )}
                            </div>
                        )}
                    </CollapsibleContent>
                </Collapsible>
            </div>
        );
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
                        <p className="text-muted-foreground">The manual you're looking for doesn't exist.</p>
                        <Button onClick={handleBack} className="mt-4">
                            Back to Manuals
                        </Button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const StatusIcon = statusIcons[manual.status];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={manual.title} />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <Button variant="ghost" size="sm" onClick={handleBack}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight">{manual.title}</h1>
                                <Badge className={statusColors[manual.status]}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {manual.status.charAt(0).toUpperCase() + manual.status.slice(1)}
                                </Badge>
                            </div>
                            {manual.iso_standard && (
                                <p className="text-lg text-muted-foreground font-medium">
                                    {manual.iso_standard}
                                </p>
                            )}
                            {manual.description && (
                                <p className="text-muted-foreground max-w-2xl">
                                    {manual.description}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        {manual.status !== 'approved' && (
                            <Button onClick={handleEdit} className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                            </Button>
                        )}
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export PDF
                        </Button>
                    </div>
                </div>

                {/* Manual Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">v{manual.version}</div>
                            <p className="text-xs text-muted-foreground">Version</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-2xl font-bold">{manual.sections?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">Sections</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-sm font-medium">{manual.creator?.name}</div>
                            <p className="text-xs text-muted-foreground">Created by</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-sm font-medium">
                                {manual.effective_date ? new Date(manual.effective_date).toLocaleDateString() : 'Not set'}
                            </div>
                            <p className="text-xs text-muted-foreground">Effective Date</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sections */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Manual Sections
                        </CardTitle>
                        <CardDescription>
                            Navigate through the manual structure and content
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {manual.sections && manual.sections.length > 0 ? (
                            <div className="space-y-2">
                                {manual.sections.map(section => renderSection(section))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <FileText className="mx-auto h-8 w-8 mb-2" />
                                <p>No sections added yet</p>
                                {manual.status !== 'approved' && (
                                    <Button variant="outline" onClick={handleEdit} className="mt-2">
                                        Add Sections
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}