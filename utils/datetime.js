function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
module.exports = {
    getNormalDate: value => {
        let dateTime = new Date(value);
        let y = dateTime.getFullYear();
        let M = addZero(dateTime.getMonth());
        let d = addZero(dateTime.getDate());
        let h = addZero(dateTime.getHours());
        let m = addZero(dateTime.getMinutes());
        return d + "/" + M + "/" + y + " " + h + ":" + m;

    }
}