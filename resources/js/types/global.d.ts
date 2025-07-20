import {PageProps as InertiaPageProps} from '@inertiajs/core';
import {AxiosInstance} from 'axios';
import {route as ziggy} from 'ziggy-js';
import type { route as routeFn } from 'ziggy-js';

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    /*eslint-disbale no-var*/
    var route: typeof ziggy;
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
    }