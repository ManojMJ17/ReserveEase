export const API_ENDPOINTS = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        ME: '/auth/me'
    },
    RESERVATIONS: {
        BASE: '/reservations',
        MY: '/reservations/my',
        CANCEL: (id: string) => `/reservations/${id}`
    },
    TABLES: {
        BASE: '/tables',
        DETAIL: (id: string) => `/tables/${id}`
    },
    ADMIN: {
        RESERVATIONS: '/admin/reservations',
        RESERVATIONS_BY_DATE: (date: string) => `/admin/reservations/date/${date}`,
        UPDATE_RESERVATION: (id: string) => `/admin/reservations/${id}`,
        DELETE_RESERVATION: (id: string) => `/admin/reservations/${id}`
    }
} as const;
