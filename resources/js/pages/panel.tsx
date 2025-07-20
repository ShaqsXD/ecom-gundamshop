import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel',
        href: '/panel',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panel" />
            <Dashboard >
                <PlaceholderPattern className="h-96 w-full" />
                <div className="text-center text-muted-foreground">
                    This is the panel page. You can add your content here.
                </div>
            </Dashboard>
        </AppLayout>
    );
}
