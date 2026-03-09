// TypeScript types for the FCIR (Flutter Community Incident Reporting) API

export interface FCIRIncident {
    id: string;
    type: string;
    title: string;
    description: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    status: string;
    priority: string;
    anonymous: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface FCIRApiResponse {
    incidents: FCIRIncident[];
    total: number;
}
