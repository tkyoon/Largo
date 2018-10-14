exports.return = function (cd, m, d) {
	var ret = new Object();
	ret.code = cd;
	ret.msg = m;
	ret.data = d;
    return ret;
};
