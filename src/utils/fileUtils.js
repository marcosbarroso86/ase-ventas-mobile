import * as FileSystem from 'expo-file-system';

import {
    MAX_SIZE_FILE, CHARS_FORBIDDEN_REGEXP, VALID_FILE_EXTENSIONS, MAX_LENGTH_FILE
} from '../consts'

export const existFile = async (file) => {
    try {
        const infoFile = await FileSystem.getInfoAsync(file.uri);
        return infoFile && infoFile.exists;
    } catch (error) {
        console.error(error);
    }
    return false;
}

export const deleteFile = async (uri) => {
    try {
        await FileSystem.deleteAsync(uri);
    } catch (error) {
        console.error(error);
    }
}

export const modifyFileName = file => {
    return replaceDiacritics(deleteTwoDots(changeInvalidFileName(deleteFirstDot(file.name))));
}

export const validateSize = async (file) => {
    return parseInt(file.size) < MAX_SIZE_FILE;
}

export const validateFileNameLength = (file) => {
    return file.name.length <= MAX_LENGTH_FILE;
}

export const validateFileExtension = (file) => {
    const fileName = file.name;
    const fileNameParts = fileName.split('.');
    const extension = (fileNameParts.length > 1) ? fileNameParts[fileNameParts.length - 1] : '';
    return VALID_FILE_EXTENSIONS.find(item => item === extension.toUpperCase());
}

// Private Functions


const getFileName = (uri) => {
    const uriParts = uri.split('/');
    return (uriParts.length > 0) ? uriParts[uriParts.length - 1] : '';
}



const checkFileExtension = (aFile) => {
    const fileName = aFile.name;
    const fileNameParts = fileName.split('.');
    const extension = (fileNameParts.length > 1) ? fileNameParts[fileNameParts.length - 1] : '';
    return VALIDATE_FILE_EXTENSIONS.find(item => item === extension.toLowerCase());
}

const changeInvalidFileName = fileName => {
    try {
        let validName = fileName.replace(CHARS_FORBIDDEN_REGEXP, '')
        if (validName.startsWith('.')) {
            validName = 'Adjunto' + validName;
        }
        return validName
    } catch (error) {
        console.error(error);
    }
    return fileName
}

const deleteFirstDot = fileName => {
    try {
        if (fileName.startsWith('.')) {
            let newName = fileName.substring(1);
            return newName
        }
    } catch (error) {
        console.error(error);
    }
    return fileName
}

const deleteTwoDots = fileName => {
    try {
        const fileNameParts = fileName.split(/\.(?=[^.]+$)/);
        const extension = '.' + fileNameParts[1];
        let newName = fileNameParts[0].replace(/\.{2,57}/g, ".").replace(RegExp(/ /g), '-');
        if (newName.endsWith('.')) newName = newName.slice(0, -1);
        newName += extension;
        return newName;
    } catch (error) {
        console.error(error);
    }
    return fileName
}

const replaceDiacritics = fileName => {
    try {
        let validName = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        return validName
    } catch (error) {
        console.log(error)
    }
    return fileName
}