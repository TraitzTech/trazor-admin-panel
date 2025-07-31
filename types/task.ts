// types/task.ts
export interface Attachment {
    id: number;
    original_name: string;
    file_size?: number;
    path: string;
    description?: string;
    uploaded_by?: string;
    created_at: string;
    updated_at: string;
}

export interface Comment {
    id: number;
    content: string;
    created_at: string;
    user?: {
        name?: string;
        avatar?: string;
    };
}

export interface InternSubmission {
    status: 'pending' | 'in_progress' | 'done' | 'cancelled';
    started_at?: string;
    completed_at?: string;
    intern_notes?: string;
    assigned_at?: string;
    updated_at?: string;
}

export interface TaskIntern {
    id: number;
    user_id: string;
    institution: string;
    matric_number: string;
    hort_number: string;
    user?: {
        name?: string;
        email?: string;
        avatar?: string;
    };
    specialty?: {
        id: number;
        name: string;
    };
    submission: InternSubmission;
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority?: string;
    due_date?: string;
    created_at: string;
    updated_at: string;
    interns: TaskIntern[];
    specialty?: {
        id: number;
        name: string;
    };
    comments: Comment[];
    attachments: Attachment[];
}