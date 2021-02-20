import axios from 'axios';
// import { store } from '@/store/store';

const API_SERVICES = process.env.VUE_APP_API_SERVICES;
console.log(API_SERVICES);

export const apiServices = axios.create({
    baseURL: API_SERVICES ? `${API_SERVICES}/` : 'nekiDrugiApi',
    pluralize: false,
    handleErrors: false,
    headers: {
        'Content-Type': 'application/vnd.api+json'
    },
});

apiServices.interceptors.response.use(response => response,
    error => Promise.reject(error));
