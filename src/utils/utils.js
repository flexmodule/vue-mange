/* 表格数据到处到Excel start */
export function export2Excel(listData, tHeader, filterVal, excelName) {　　　　　　
    require.ensure([], () => {　　　　　　　　
        const { export_json_to_excel } = require('../vendor/Export2Excel');　　　　　　　
        const data = listData.map(v => filterVal.map(j => v[j]));　　　　　　　　
        export_json_to_excel(tHeader, data, excelName);　　　　　　
    })　　　　
}
/* 表格数据到处到Excel end */

/* excel处理 start */
// const XLSX = require('xlsx')
export function excel2Json(e) {
    var reader = new FileReader()
    var finalDataObj = []
    reader.onload = function(e) {
        let excelData = to_json(XLSX.read(e.target.result, { type: "binary" }))
        let xlsxData = excelData.Sheet1

        for (var i = 0; i < xlsxData.length; i++) {
            finalDataObj.push({
                id: xlsxData[i]["序号"],
                identity: xlsxData[i]["身份证号"],
                employeeNo: xlsxData[i]["员工号"],
                checkupNo: xlsxData[i]["体检编号"],
                realName: xlsxData[i]["姓名"],
                sex: xlsxData[i]["性别"],
                age: xlsxData[i]["年龄"],
                married: xlsxData[i]["婚否情况"] === '是' ? true : false,
                mobilePhone: xlsxData[i]["手机号"]
            })
        }
        console.log(finalDataObj)
    }
    reader.readAsBinaryString(e.target.files[0])
}

function to_json(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if (roa.length > 0) {
            result[sheetName] = roa;
        }
    });
    return result;
}

/* excel处理 end */

export function formatTime(timeStamp) {
    let date = new Date(timeStamp)
    let Y = date.getFullYear() //年
    let M = date.getMonth() //月
    let D = date.getDate() //日
    let h = date.getHours() //时
    let m = date.getMinutes() //分
    let s = date.getSeconds() //秒
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
}

/* cookie的存取 start */
// import Cookies from 'js-cookie'

const TokenKey = 'Authorization'
const UserName = 'UserName'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}
export function getName() {
    return Cookies.get(UserName)
}
export function setName(name) {
    return Cookies.set(UserName, name)
}

export function deleteToken() {
    return Cookies.remove(TokenKey)
}

export function deleteUserName() {
    return Cookies.remove(UserName)
}
/* cookie的存取 end */