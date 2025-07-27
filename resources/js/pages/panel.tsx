import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

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
            <PlaceholderPattern className="h-96 w-full" />
            <div className="text-center text-muted-foreground">
                This is the panel page. You can add your content here.
                <Link  href={route('login')} className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Back to Login
                </Link>
            </div>
        </AppLayout>
    );
}
