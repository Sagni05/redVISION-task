import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const onTostifySuccess = (msg) => {
    toast.success(msg, {
        position: 'bottom-right',
        className: 'toast-message',
    });
}

export const onTostifyFailure = (msg) => {
    toast.error(msg, {
        position: 'bottom-right',
        className: 'toast-message',
    });
}

export const onTostifyWarning = (msg) => {
    toast.warn(msg, {
        position: 'bottom-right',
        className: 'toast-message',
    });
}
