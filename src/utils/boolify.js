const arr = [true, false, "true", "false", 1, 0];

exports.isBoolean = (arg, { isTrue = true, isFalse = false } = {}) => {
    if (arr.indexOf(arg) === -1) {
        return false;
    } else {
        return true;
    }
}

exports.Boolify = (arg, { isNull = null, isTrue = true, isFalse = false } = {}) => {
    if (arr.indexOf(arg) === -1) {
        return isNull;
    } else {
        return (arg == true || arg == "true" || arg == 1) ? isTrue : isFalse;
    }
}