import {AsyncStorage} from 'react-native';


import { MALE_GENDER, CUIL, CUIT, COUNTRY_CODE, PHONE_NUMBER, EMAIL, FIRST_NAME, LAST_NAME, EMPTY_MESSAGE, 
    EMPTY_USER_SURNAME, EMPTY_USER_NAME, EMPTY_PASSWORD, EMPTY_USERNAME, WRONG_FORMAT_EMAIL, EMPTY_CUIL,
    EMPTY_CUIT, WRONG_CUIL, WRONG_CUIT, EMPTY_USER_EMAIL, USER_NAME, PASSWORD, UNAVAILABLE_USER,
    ERROR_BLOCKED_USER, ERROR_WRONG_USER_PASSWORD, BLOCKED_USER_MESSAGE, WRONG_USER_PASSWORD_MESSAGE, 
    SERVER_ERROR_MSSG, NETWORK_ERROR, NETWORK_ERROR_MSSG, PHOTO, INTERNET_ERROR, WRONG_COUNTRY_CODE,
    WRONG_ARGENTINE_AREA_CODE, WRONG_PHONE_NUMBER, ERROR_INVALID_CODE, ERROR_INVALID_CODE_MESSAGE,
    PENDING_VALIDATION, PENDING_VALIDATION_MESSAGE, EXPIRED_CODE, PASSWORD_ERROR_VALIDATION_MSSG,
    PASSWORDS_MUST_BE_EQUALS, PENDING_VALIDATION_STATE_ID, COMMERCIAL_APPROVED_STATE_ID, 
    COMMERCIAL_REJECTED_STATE_ID, ABM_APPROVED_STATE_ID, ABM_REJECTED_STATE_ID, 
    PENDING_COMMERCIAL_REVIEW_STATE_ID, INVALID_EMAIL, ERROR_INVALID_EMAIL, FILE_NOT_LOAD, UNAVAILABLE_USER_MESSAGE, FEMALE_GENDER
} from '../consts';

import NetInfo from "@react-native-community/netinfo";



export const saveItem = async (keyName, keyValue) => {
    try {
        await AsyncStorage.setItem(keyName,keyValue)
        return true;
    } catch (error) {
        console.log(error);
    }
}

export const buildErrMssg = (form) =>{
    let errMssg = {};

    for(let field of Object.keys(form)){
        errMssg[field] = validateField(form, field);
    }

    return errMssg;
}

export const validateCuitInput = (text) => {
    return (/^(20|23|24|27|30|33|34)([0-9]{2,})$/gm.test(text) ||
        /^(20|23|24|27|30|33|34)(-[0-9]{8})$/gm.test(text) ||
        /^(20|23|24|27|30|33|34)(-[0-9]{8}-)$/gm.test(text) ||
        /^(20|23|24|27|30|33|34)(-[0-9]{8}-[0-9]{1})$/gm.test(text))
}

const validateField = (form,field) =>{
    let errMssg = "";
    switch(field){
        case USER_NAME:
            errMssg= emptyField(form[field],EMPTY_USERNAME);
            break;
        case PASSWORD:
            errMssg= emptyField(form[field],EMPTY_PASSWORD);
            break;
        case FIRST_NAME:
            errMssg= emptyField(form[field],EMPTY_USER_NAME);
            break;
        case LAST_NAME:
            errMssg= emptyField(form[field],EMPTY_USER_SURNAME);
            break;
        case CUIL:
            errMssg = wrongCUIL(form[field], form['gender']);
            break;
        case COUNTRY_CODE:
            errMssg= validateCountryCode(form[field]);
            break;
        case PHONE_NUMBER:
            errMssg= validatePhoneNumber(form.countryCode, form.areaCode, form[field]);
            break;
        case EMAIL:
            errMssg = wrongEmail(form[field]);
            break;
        case CUIT:
            errMssg= wrongCUIT(form[field]);
            break;
        case PHOTO:
            errMssg = emptyPhoto(form[field]);
            break;
        default:
            break;
    }
    return errMssg;
}


const emptyPhoto = (photo)=>{
    if (!photo) {
        return FILE_NOT_LOAD;
    }else{
        return EMPTY_MESSAGE;
    }
}

const wrongCUIL = (cuil,gender) =>{
    if(!cuil.trim()){
        return EMPTY_CUIL;
    }else {
        if(!validateCUIL(cuil,gender)){
            return WRONG_CUIL;
        }else{
            return EMPTY_MESSAGE;
        }
    }    
}

const wrongCUIT = (cuit) =>{
    if(!cuit.trim()){
        return EMPTY_CUIT;
    }else {
        if(!validateCUIT(cuit)){
            return WRONG_CUIT;
        }else{
            return EMPTY_MESSAGE;
        }
    }    
}

const validateCUIT =(cuit) =>{
    let parsedCuit = replaceCharacters(cuit);
    return (!isNaN(parsedCuit) && parsedCuit.length === 11);
}

const validateCountryCode =(countryCode) =>{
    return countryCode.length === 1 ? WRONG_COUNTRY_CODE : EMPTY_MESSAGE;
}

const validateArgentineAreaCode = (areaCode) => {

    //TODO: debería obtener todos los códigos de área desde un .json
    let validAreas = [
        '11', '220', '2202', '221', '2221', '2223', '2224', '2225', '2226', '2227',
        '2229', '223', '2241', '2242', '2243', '2244', '2245', '2246', '2252', '2254',
        '2255', '2257', '2261', '2262', '2264', '2265', '2266', '2267', '2268', '2271',
        '2272', '2273', '2274', '2281', '2283', '2284', '2285', '2286', '2291', '2292',
        '2296', '2297', '230', '2302', '2314', '2316', '2317', '2320', '2323', '2324',
        '2325', '2326', '2331', '2333', '2334', '2335', '2336', '2337', '2338', '2342',
        '2343', '2344', '2345', '2346', '2352', '2353', '2354', '2355', '2356', '2357',
        '2358', '236', '237', '2392', '2393', '2394', '2395', '2396', '2473', '2474',
        '2475', '2477', '2478', '249', '260', '261', '2622', '2624', '2625', '2626',
        '263', '264', '2646', '2647', '2648', '2651', '2655', '2656', '2657', '2658',
        '266', '280', '2901', '2902', '2903', '291', '2920', '2921', '2922', '2923',
        '2924', '2925', '2926', '2927', '2928', '2929', '2931', '2932', '2933', '2934',
        '2935', '2936', '294', '2940', '2942', '2945', '2946', '2948', '2952', '2953',
        '2954', '2962', '2963', '2964', '2966', '297', '2972', '298', '2982', '2983',
        '299', '3327', '3329', '336', '3382', '3385', '3387', '3388', '3400', '3401',
        '3402', '3404', '3405', '3406', '3407', '3408', '3409', '341', '342', '343',
        '3435', '3436', '3437', '3438', '3442', '3444', '3445', '3446', '3447', '345',
        '3454', '3455', '3456', '3458', '3460', '3462', '3463', '3464', '3465', '3466',
        '3467', '3468', '3469', '3471', '3472', '3476', '348', '3482', '3483', '3487',
        '3489', '3491', '3492', '3493', '3496', '3497', '3498', '351', '3521', '3522',
        '3524', '3525', '353', '3532', '3533', '3537', '3541', '3542', '3543', '3544',
        '3546', '3547', '3548', '3549', '3562', '3563', '3564', '3571', '3572', '3573',
        '3574', '3575', '3576', '358', '3582', '3583', '3584', '3585', '362', '364',
        '370', '3711', '3715', '3716', '3718', '3721', '3725', '3731', '3734', '3735',
        '3741', '3743', '3751', '3754', '3755', '3756', '3757', '3758', '376', '3772',
        '3773', '3774', '3775', '3777', '3781', '3782', '3786', '379', '380', '381',
        '3821', '3825', '3826', '3827', '383', '3832', '3835', '3837', '3838', '3841',
        '3843', '3844', '3845', '3846', '385', '3854', '3855', '3856', '3857', '3858',
        '3861', '3862', '3863', '3865', '3867', '3868', '3869', '387', '3873', '3876',
        '3877', '3878', '388', '3885', '3886', '3887', '3888', '3891', '3892', '3894'
    ];

    return validAreas.includes(areaCode) ? EMPTY_MESSAGE : WRONG_ARGENTINE_AREA_CODE;
}

export const validatePassword =(password, secondPassword)=>{
    if(!passwordsAreEquals(password,secondPassword)){
      return PASSWORDS_MUST_BE_EQUALS;
    }
    if(password.search(/[A-Z]/g) === -1){
      return PASSWORD_ERROR_VALIDATION_MSSG;
    }
    if(password.search(/[0-9]/g) === -1){
      return PASSWORD_ERROR_VALIDATION_MSSG;
    }
    if(password.search(/[a-z]/g) === -1){
      return PASSWORD_ERROR_VALIDATION_MSSG;
    }
    if(password.length < 8){
      return PASSWORD_ERROR_VALIDATION_MSSG;
    }
  }

const validatePhoneNumber = (countryCode, areaCode, phoneNumber) => {
    let errMssg = "";

    let fullPhone = countryCode.trim() + areaCode.trim() + phoneNumber.replace('-', '').trim();

    if (countryCode.trim() === "+54") {
        errMssg = validateArgentineAreaCode(areaCode);

        if (errMssg !== EMPTY_MESSAGE) {
            return WRONG_ARGENTINE_AREA_CODE;
        } else {
            return fullPhone.length < 13 ? WRONG_PHONE_NUMBER : EMPTY_MESSAGE;
        }

    } else {
        return fullPhone.trim().length < 10 ? WRONG_PHONE_NUMBER : EMPTY_MESSAGE;
    }
}

const wrongEmail = (email) =>{
    if(!email.trim()){
        return EMPTY_USER_EMAIL;
    }else {
        if(!validateEmail(email)){
            return WRONG_FORMAT_EMAIL;
        }else{
            return EMPTY_MESSAGE;
        }
    }
}

const emptyField = (value, mssg) =>{
    if(!value.trim()){
        return mssg;
    }else{
        return EMPTY_MESSAGE;
    }
}

const validateCUIL =(cuil,gender) =>{
    let genderCode = cuil.split('-')[0];

    if(gender === MALE_GENDER){
        if(genderCode != 20 && genderCode != 23 && genderCode != 24){
            return false;
        }
    } else {
        if (gender === FEMALE_GENDER) {
            if (genderCode != 27 && genderCode != 23 && genderCode != 24) {
                return false;
            }
        }
    }
    return validate(cuil);
}

const validate = (code) =>{
    
    let digits = parseCode(code);
    if(digits.length !== 11){
      return false;
    }

    let verifierDigit = digits.pop();
    
    let calculatedDigit = calculateVerifierDigit(digits);

    return (verifierDigit == calculatedDigit);
}

const calculateVerifierDigit = (digits) =>{
    let acumulated = 0;
    for(let i = 0; i < digits.length; i++) {
      acumulated += digits[9 - i] * (2 + (i % 6));
    }

    let calculatedDigit = 11 - (acumulated % 11);
    if(calculatedDigit === 11) {
      calculatedDigit = 0;
    }
    return calculatedDigit;
}

const parseCode = (code) =>{
    let aux = code.split("");
    let digits = [];
    for(let digit of aux ){
      if(digit !=='-'){
        digits.push(digit);
      }
    }
    return digits;
}

export const buildDomain = (text) => {
    return text.split('@')[1];
}

export const validateEmail= (email) => {
    // Explicación reg https://www.w3resource.com/javascript/form/email-validation.php
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return (reg.test(email) !== false);
}

const isBusinessName= (param) => {
    let reg = /^\d{2}[\d.\-\s]\d{2}$/;
    return (reg.test(param) === false);
}

//TODO: ESTO QUEDO VIEJO, AHORA CON LOS FILTROS AVANZADOS LOS PASAMOS EN LA URL DEL REQUEST
//LOS PARAMETROS DE FILTRADO, FIJARSE DE REFACTORIZAR EN LOS REQUEST QUE SE SIGUEN USANDO
export const buildQueryParams =(params,page, pageSize)=>{
    let queryParams = {};

    if (params.domain) queryParams.domain = params.domain;
    if (params.description) queryParams.description = params.description;
    if(params.email) queryParams.email = params.email;
    if(params.text) buildTextParams(queryParams, params.text);

    buildPaginationParams(queryParams,page,pageSize);

    return queryParams;
}

//TODO: ESTO QUEDO VIEJO
export const buildPaginationParams = (params,pageNumber,pageSize) =>{
    if(params){
        if(pageSize){
            params.size = pageSize;
        }
        if(pageNumber){
            params.page = pageNumber;
        }
    }
}

export const buildUrlParams =(params, page, pageSize, orders) => {
    let url = '?';
    if(params && Object.keys(params).length > 0){
       // url = '?';
        for( let key of Object.keys(params)){
            if(url === '?'){
                url+=`${key}=${buildQueryParam(params[key])}`;
            }else{
                url+=`&${key}=${buildQueryParam(params[key])}`;
            }
        }
    }
    if(page && pageSize) url+=`&page=${page}&size=${pageSize}`;
    if (orders) url+=`&orders=${orders}`;
    return url;
}

const buildQueryParam = (param) =>{
    let condition = "";
    if((typeof param !== 'string') && Object.keys(param).length >0){
        let operator = Object.keys(param)[0];
        let values = buildValues(Object.values(param)[0]);
        condition =`${operator}:${values}`;
    }else{
        condition = param;
    }
    return condition;
}

const buildValues = (values) =>{
    let stringOfValues = "";
    let begining = true;
    if(Array.isArray(values)){
        for(let i =0;i < values.length;i++){
            if(begining){
                stringOfValues += `${values[i]}`;
                begining = false;
            }else{
                stringOfValues += `,${values[i]}`;
            }
        }
        return stringOfValues;
    }else{
        return values;
    }
}

//TODO: REVISAR CASOS DE PRUEBA, NO ME ESTA GUSTANDO TANTO, PORQUE SI TIRA UN 404, POR EJEMPLO DESDE LA VISTA
//LE ARMO MAL EL ENTITY PARAM
//ESTA LOGUEANDO QUE HUBO UN ERROR EN EL SERVIDOR Y LOGUEA UNDEFINED (ME SUENA A QUE EN EL BACKEND 
// ESTA ARMANDO MAL EL RESPONSE, NO LE PASA NINGUN MENSAJE)
//HAY QUE ANALIZAR BIEN LOS CASOS
export const handleErrorResponse = (error) =>{
    if(error.response){
        console.log('Error ' + error.response.data.message);
        return buildServerErrorMessage(error.response.data.message);
    }else{
        console.log('Error ' + error.message);
        return buildOtherErrorMessage(error.message);
    }
}

//TODO: VER DE CAMBIARLO POR UN SWITCH, SI ESTO CRECE MUCHO
//SI POR EJEMPLO EL SERVER EMPIEZA A ENVIAR MUCHAS MAS EXCEPCIONES DE NEGOCIO
const buildServerErrorMessage = (message) =>{
    if(message){
        if(message.includes(ERROR_WRONG_USER_PASSWORD)){
            return WRONG_USER_PASSWORD_MESSAGE;
        }
        if(message.includes(UNAVAILABLE_USER)){
            return UNAVAILABLE_USER_MESSAGE;
        }
        if(message.includes(ERROR_BLOCKED_USER)){
            return BLOCKED_USER_MESSAGE;
        }
        if(message.includes(ERROR_INVALID_CODE)){
            return ERROR_INVALID_CODE_MESSAGE;
        }
        if(message.includes(PENDING_VALIDATION)){
            return PENDING_VALIDATION_MESSAGE;
        }
        if(message.includes(EXPIRED_CODE)){
            return ERROR_INVALID_CODE_MESSAGE;
        }
        if(message.includes(INVALID_EMAIL)){
            return ERROR_INVALID_EMAIL;
        }
    }
    return SERVER_ERROR_MSSG;
}

const buildOtherErrorMessage = (message) =>{
    if (message && message.includes(NETWORK_ERROR)){
        return NETWORK_ERROR_MSSG;
    }else{
        return message;
    }
}

export const replaceCharacters = (text) =>{
    return text.replace(/-/g, '');
}

export  const passwordsAreEquals = (password, secondPassword)=>{
    return (password === secondPassword);
}

export const getItem = async(keyName)=>{
    try {
        return await AsyncStorage.getItem(keyName);
    }catch(error){  
        return false;
    }
}

export const eraseItem = async(keyName)=>{
    try {
        return await AsyncStorage.removeItem(keyName);
    }catch(error){  
        return false;
    }
}

export const clearAll = async ()=>{
    try {
        return await AsyncStorage.clear();
    }catch(error){  
        return false;
    }
}

export const sleep = (milliseconds = 1000) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export const buildRequest = ( url, method, data,params, headers) =>{
    const obj = {};
    
    if(url) obj.url = url;   
    if(method) obj.method = method;
    if(data) obj.data = data;
    if(headers) obj.headers = headers;
    if(params) obj.params = params;
    return obj;

}

const buildTextParams = (queryParams,param)=>{
    let subText = param.substring(0,5);
    if(isBusinessName(subText)){
        queryParams.businessName = param;
    }else{
        queryParams.cuit = replaceCharacters(param);
    }
}

//TODO: HACERLO GENERICO, QUE TE PERMITA APPENDEAR DINAMICAMENTE EN FUNCION
// DE LOS ATRIBUTOS QUE LE PASES

export const buildBody = (data) =>{

    const filestypes = [];    
    
    let body = new FormData();
    body.append('cuil',data.cuil);
    data.commercialAnalistCod && body.append('commercialAnalystCod',data.commercialAnalistCod);
    body.append('cuit',data.cuit);
    body.append('gender', data.gender);
    body.append('executive', JSON.stringify(data.executive));
    body.append('file', {
        uri: Platform.OS === "android" ? data.file.uri : data.file.uri.replace("file://", ""),
        name: 'formulario_01.' + data.file.uri.substr(data.file.uri.lastIndexOf('.') + 1),
        type: 'image/jpg',
    });
    //TODO: REFACTOR
    filestypes.push(setFileType(data , 'file'));
    body.append('companyExist', data.companyExist);
    body.append('source',data.source)
    if(data.file2) {
        body.append('file', {
            uri: Platform.OS === "android" ? data.file2.uri : data.file2.uri.replace("file://", ""),
            name: 'formulario_secundario.' + data.file2.uri.substr(data.file2.uri.lastIndexOf('.') + 1),
            type: 'image/jpg',
        });

        filestypes.push(setFileType(data, 'file2'));
    }
    body.append('fileType', JSON.stringify(filestypes))
    if(data.prospectId) {
        body.append('prospectId', data.prospectId)
    }
    return body;
}

export const checkInternetConnection = async () => {
    const state = await NetInfo.fetch();
    if (!state.isConnected || state.details?.cellularGeneration === "2g") throw new Error(INTERNET_ERROR)
}

export const getStateColor = (idState) => {
    switch (idState) {
        case PENDING_VALIDATION_STATE_ID:
            return {color: 'orange'};
        case COMMERCIAL_APPROVED_STATE_ID:
            return {color: 'green'};
        case COMMERCIAL_REJECTED_STATE_ID:
            return {color: 'red'};
        case ABM_APPROVED_STATE_ID:
            return {color: 'green'};
        case ABM_REJECTED_STATE_ID:
            return {color: 'red'};
        case PENDING_COMMERCIAL_REVIEW_STATE_ID:
            return {color: 'orange'};
        default:
            return {color: 'black'};
    }
}
const setFileType = (data, file) => {
    return {
        type: file === 'file' ? 'FORM 01' : 'FORM SECUNDARIO',
        name: file === 'file' ? 'formulario_01.' + data.file.uri.substr(data.file.uri.lastIndexOf('.') + 1)
            : 'formulario_secundario.' + data.file2.uri.substr(data.file2.uri.lastIndexOf('.') + 1)
    };
}




