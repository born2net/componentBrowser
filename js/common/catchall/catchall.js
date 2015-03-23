window.onerror = function (msg, url, line, col, error) {
    if (debug){
        var extra = !col ? '' : '\ncolumn: ' + col;
        extra += !error ? '' : '\nerror: ' + error;
        alert("err 1: " + msg + "\nurl: " + url + "\nline: " + line + extra);
        var suppressErrorAlert = true;
        return suppressErrorAlert;
    }
};
