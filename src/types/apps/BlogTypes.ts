interface blogProfile {
    id: number;
    avatar: string;
    name: string;
}

export type blogType = {
    id?: string | number;
    profile?: blogProfile;
    time?: Date;
    comment?: string;
    replies?: blogType[];
};

export type blogpostType = {
    id?: string | number;
    title?: string;
    displayTitle?: string;
    content?: string;
    coverImg?: string;
    createdAt?: string | Date;
    view?: number;
    share?: number;
    category?: string;
    featured?: boolean;
    author?: blogProfile;
    comments?: blogType[];
    level?: string;
    semester?: string;
    academicYear?: string;
    accessType?: string;
    classCode?: string;
    descriptionHtml?: string;
    gradingCriteria?: Array<{ name: string; percentage: number }>;
    courseSummary?: string;
    modules?: Array<{ id: number; title: string; duration: string; type: string; status: string; progress: number; }>; 
    assignments?: Array<{ id: number; title: string; due: string; type: string; status: string; points: number; }>; 
    members?: Array<{ id: number; name: string; role: string; progress: number; avatar: string; }>; 
    reports?: Array<{ label: string; value: string; change: string; trend: 'up' | 'down' | 'neutral'; }>; 
    settings?: Array<{ key: string; value: string; detail: string; }>; 
};
