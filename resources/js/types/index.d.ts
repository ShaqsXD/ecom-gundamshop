import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

// ISO Manual Types
export interface IsoManual {
    id: number;
    title: string;
    iso_standard?: string;
    description?: string;
    version: string;
    status: 'draft' | 'review' | 'approved' | 'archived';
    created_by: number;
    approved_by?: number;
    approved_at?: string;
    effective_date?: string;
    review_date?: string;
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
    creator?: User;
    approver?: User;
    sections?: ManualSection[];
    documents?: Document[];
    revisions?: Revision[];
}

export interface ManualSection {
    id: number;
    manual_id: number;
    parent_section_id?: number;
    section_number: string;
    title: string;
    content?: string;
    order_index: number;
    section_type: 'chapter' | 'section' | 'subsection' | 'appendix';
    is_required: boolean;
    requirements?: Record<string, any>;
    created_at: string;
    updated_at: string;
    manual?: IsoManual;
    parent_section?: ManualSection;
    child_sections?: ManualSection[];
    procedures?: Procedure[];
    documents?: Document[];
    revisions?: Revision[];
    full_section_number?: string;
}

export interface Procedure {
    id: number;
    section_id: number;
    procedure_code: string;
    title: string;
    purpose?: string;
    scope?: string;
    procedure_steps?: string;
    responsibilities?: string;
    references?: string;
    records?: string;
    status: 'draft' | 'review' | 'approved' | 'obsolete';
    version: string;
    owner_id: number;
    review_date?: string;
    effective_date?: string;
    attachments?: string[];
    created_at: string;
    updated_at: string;
    section?: ManualSection;
    owner?: User;
    documents?: Document[];
    revisions?: Revision[];
}

export interface Document {
    id: number;
    manual_id: number;
    section_id?: number;
    procedure_id?: number;
    document_code: string;
    title: string;
    description?: string;
    document_type: 'form' | 'template' | 'checklist' | 'record' | 'policy' | 'instruction' | 'other';
    file_path?: string;
    file_name?: string;
    file_type?: string;
    file_size?: number;
    version: string;
    status: 'draft' | 'review' | 'approved' | 'obsolete';
    created_by: number;
    approved_by?: number;
    approved_at?: string;
    review_date?: string;
    tags?: string[];
    created_at: string;
    updated_at: string;
    manual?: IsoManual;
    section?: ManualSection;
    procedure?: Procedure;
    creator?: User;
    approver?: User;
    revisions?: Revision[];
    file_size_human?: string;
}

export interface Revision {
    id: number;
    revisionable_type: string;
    revisionable_id: number;
    version: string;
    changes_summary: string;
    old_data?: Record<string, any>;
    new_data?: Record<string, any>;
    change_type: 'created' | 'updated' | 'approved' | 'archived';
    changed_by: number;
    changed_at: string;
    change_reason?: string;
    is_major_change: boolean;
    created_at: string;
    updated_at: string;
    changed_by_user?: User;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}
