import * as moment from 'moment-timezone';
import 'moment/locale/es'

export const TIMEZONE_AR_BSAS = 'America/Argentina/Buenos_Aires';
export const DATE_FORMAT_YYYY_MM_DD = 'YYYY-MM-DD';
export const DATE_FORMAT_YYYY_MM_DD_HH_MM_SS = 'DD/MM/YYYY, HH:mm:ss';
export const DATE_FORMAT_YYYY_MMMM_DD_HH_MM = 'DD [de] MMMM [de] YYYY - HH:mm';

export const getToday = () => {
    return new Date();
}

export const getDate = (milliseconds) => {
    return (milliseconds) ? new Date(milliseconds) : getToday();
}

export const isExpiredTime = (time) => {
    return Math.floor(Date.now() / 1000) > time;
}

export const format = (aDate, aFormat) => {
    try {
        aFormat = (aFormat) ? aFormat : DATE_FORMAT_YYYY_MM_DD;
        return moment.tz(aDate, TIMEZONE_AR_BSAS).locale('es').format(aFormat);
    } catch (error) {
        console.error(error);
    }
    return '';
} 