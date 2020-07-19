/**
 * 获取字符串的长度ascii长度为1 中文长度为2
 * @param str
 * @returns {number}
 */
export const getStrFullLength = (str = '') =>
  str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1
    }
    return pre + 2
  }, 0)

/**
 * 给定一个字符串和一个长度,将此字符串按指定长度截取
 * @param str
 * @param maxLength
 * @returns {string}
 */
export const cutStrByFullLength = (str = '', maxLength) => {
  let showLength = 0
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0)
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1
    } else {
      showLength += 2
    }
    if (showLength <= maxLength) {
      return pre + cur
    }
    return pre
  }, '')
}

export const similar = (s, t, f)=>{
    if (!s || !t) {
        return 0
    }
    var l = s.length > t.length ? s.length : t.length
    var n = s.length
    var m = t.length
    var d = []
    f = f || 3
    var min = function(a, b, c) {
        return a < b ? (a < c ? a : c) : (b < c ? b : c)
    }
    var i, j, si, tj, cost
    if (n === 0) return m
    if (m === 0) return n
    for (i = 0; i <= n; i++) {
        d[i] = []
        d[i][0] = i
    }
    for (j = 0; j <= m; j++) {
        d[0][j] = j
    }
    for (i = 1; i <= n; i++) {
        si = s.charAt(i - 1)
        for (j = 1; j <= m; j++) {
            tj = t.charAt(j - 1)
            if (si === tj) {
                cost = 0
            } else {
                cost = 1
            }
            d[i][j] = min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
        }
    }
    let res = (1 - d[n][m] / l)
    return res.toFixed(f)
}
// 求最长公共子序列的长度
export const lcs = function(str1, str2) {
    var len1 = str1.length;
    var len2 = str2.length;
    var dp = []; // 首先定义一个一维数组
    for (var i = 0; i <= len1; i++) {
        dp[i] = []; // 将一维数组升级为二维数组
        for (var j = 0; j <= len2; j++) {
            if (i == 0 || j == 0) {
                dp[i][j] = 0;
                continue;
            }
            if (str1[i - 1] == str2[j - 1]) { // dp 的维度为 (len1+1)*(len2+1),str 的维度为 (len1)*(len2)
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i][j - 1], dp[i - 1][j]); // 否则取当前位置上或左的最大数
            }
        }
    }
    return dp[len1][len2]; // 返回二维数组最后一个值
}

/*export const  findSubStr = function(str1, str2){
    if (str1.length > str2.length) {
        var temp = str1;
        str1 = str2;
        str2 = temp;
    }
    var len1 = str1.length,
        len2 = str2.length;
    for (var j = len1; j > 0; j--) {
        for (var i = 0; i < len1 - j; i++) {
            var current = str1.substr(i, j);
            if (str2.indexOf(current) >= 0) {
                return current;
            }
        }
    }
    return "";
}*/
export const  findSubStr = function(str1,str2){
    //创建一个二维数组
    let temp = new Array()
    let max = 0
    let index = null
    for (let i = 0; i < str1.length; i++) {
        //初始化为二维数组
        temp[i] = new Array()
        for (let j = 0; j < str2.length; j++) {
            //比较两个位置是否相等，相等就将让temp[i][j]相对于temp[i-1][j-1]加一（前提是temp[i-1][j-1]存在）
            if(str1.charAt(i) === str2.charAt(j)){
                if(i>0&&j>0&&temp[i-1][j-1]>0){
                    temp[i][j] = 1 + temp[i-1][j-1]
                } else{
                    temp[i][j] = 1
                }
                //保存当前temp中最大的数字，并
                if(max<temp[i][j]){
                    max = temp[i][j]
                    index = i
                }
            } else {
                temp[i][j] = 0
            }
        }
    }
    //console.log(max+"+"+index)
   // return str1.substr(index-max+1,max)
    return max
}

export const matchSite = function(str1,str2){
    var strs = new Array();
    strs  = str2.split("+");
    for(var i=0;i<strs.length;i++){
        if(str1.indexOf(strs[i])!=-1){

            return true;
        }
    }
    return false;
}

export const  matchRate  = function (arg){
    if (arg == 1){
        return arg;
    }
    return  Math.ceil((arg/2)) + 1
}
