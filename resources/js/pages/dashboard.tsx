import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem, type IsoManual } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { 
    FileText, 
    CheckCircle, 
    Clock, 
    AlertCircle, 
    Calendar,
    TrendingUp,
    Users,
    Archive
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    stats: {
        total_manuals: number;
        approved_manuals: number;
        draft_manuals: number;
        review_manuals: number;
        total_sections: number;
        total_procedures: number;
        total_documents: number;
    };
    recentManuals: IsoManual[];
    upcomingReviews: IsoManual[];
}

export default function Dashboard({ stats, recentManuals, upcomingReviews }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">ISO Management Dashboard</h1>
                    <p className="text-muted-foreground">
                        Monitor and manage your ISO compliance documentation
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Manuals</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_manuals}</div>
                            <p className="text-xs text-muted-foreground">
                                ISO compliance manuals
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.approved_manuals}</div>
                            <p className="text-xs text-muted-foreground">
                                Active manuals
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.review_manuals}</div>
                            <p className="text-xs text-muted-foreground">
                                Pending approval
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                            <AlertCircle className="h-4 w-4 text-gray-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-600">{stats.draft_manuals}</div>
                            <p className="text-xs text-muted-foreground">
                                In development
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Manuals */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Manuals</CardTitle>
                                    <CardDescription>
                                        Latest manual updates and creations
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/iso-manuals">View All</Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentManuals.length > 0 ? (
                                <div className="space-y-4">
                                    {recentManuals.map((manual) => (
                                        <div key={manual.id} className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {manual.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {manual.iso_standard} • v{manual.version}
                                                </p>
                                            </div>
                                            <Badge 
                                                variant={manual.status === 'approved' ? 'default' : 'secondary'}
                                                className="text-xs"
                                            >
                                                {manual.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                    <FileText className="mx-auto h-8 w-8 mb-2" />
                                    <p>No manuals created yet</p>
                                    <Button variant="outline" size="sm" className="mt-2" asChild>
                                        <Link href="/iso-manuals/create">Create First Manual</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Reviews */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Reviews</CardTitle>
                            <CardDescription>
                                Manuals requiring review in the next 30 days
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {upcomingReviews.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingReviews.map((manual) => (
                                        <div key={manual.id} className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {manual.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {manual.review_date && new Date(manual.review_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                Review Due
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                    <Calendar className="mx-auto h-8 w-8 mb-2" />
                                    <p>No reviews due soon</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_sections}</div>
                            <p className="text-xs text-muted-foreground">
                                Across all manuals
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Procedures</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_procedures}</div>
                            <p className="text-xs text-muted-foreground">
                                Documented processes
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Documents</CardTitle>
                            <Archive className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_documents}</div>
                            <p className="text-xs text-muted-foreground">
                                Supporting documents
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
