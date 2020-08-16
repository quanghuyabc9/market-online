exports.errorHandle = promise => {
    return promise.then(data => [data, undefined])
        .catch(err => [undefined, err]);
};
exports.milisecondToDateTime = milisecond => {
    var oDate = new Date(milisecond);
    var result;
    result = oDate.getFullYear()
        + '-'
        + ((oDate.getMonth() + 1 < 10) ? '0' + (oDate.getMonth() + 1) : (oDate.getMonth() + 1))
        + '-' +((oDate.getDate() < 10) ? '0' + (oDate.getDate()) : oDate.getDate()) 
        + ' ' + ((oDate.getHours() < 10) ? '0' + (oDate.getHours()) : oDate.getHours()) 
        + ':' + ((oDate.getMinutes() < 10) ? '0' + (oDate.getMinutes()) : oDate.getMinutes())
        + ':' + ((oDate.getSeconds() < 10) ? '0' + (oDate.getSeconds()) : oDate.getSeconds());
    return result;
}
exports.yyyymmdd_mmddyyyy = date => {
    let tmp = date.split(' ');
    let tmp2 = tmp[0].split('-');
    return tmp2[1] + '/' + tmp2[0] + '/' + tmp2[2] + ' ' + tmp[1];
}
exports.convertDate = date => {
    return date.getFullYear() + '-' +
    ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth()+1) : (date.getMonth() + 1)) + '-' +
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) 
    + ' ' + ((date.getHours() < 10) ? '0' + (date.getHours()) : date.getHours()) 
    + ':' + ((date.getMinutes() < 10) ? '0' + (date.getMinutes()) : date.getMinutes())
    + ':' + ((date.getSeconds() < 10) ? '0' + (date.getSeconds()) : date.getSeconds());
}