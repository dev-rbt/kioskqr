export const isElastic = () => {
    if (typeof window === 'undefined') return false;
    return navigator.userAgent.includes('ElasticKiosk');
};
