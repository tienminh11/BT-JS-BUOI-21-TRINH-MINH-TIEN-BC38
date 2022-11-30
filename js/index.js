// chức năng
var personnelList = [];
var mode = "create";
// DOM tới input
function CreatePersonnel() {
  if (!validateForm()) return;

  var account = document.getElementById("tknv").value;
  var fullName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var datepicker = document.getElementById("datepicker").value;
  var salary = document.getElementById("luongCB").value * 1;
  var position = document.getElementById("chucvu").value;
  var workTime = document.getElementById("gioLam").value * 1;
  // check tài khoản trùng nhau
  for (var i = 0; i < personnelList.length; i++) {
    if (personnelList[i].account === account) {
      alert("Tài khoản đã tồn tại");
      return;
    }
  }
  // tạo đối tượng nhân viên
  var personnel = new Personnel(
    account,
    fullName,
    email,
    password,
    datepicker,
    salary,
    position,
    workTime
  );

  personnelList.push(personnel);
  renderPersonel(); //hiển thị đối tượng khi tạo đối tượng
  savePersonnelList(); //Lưu danh sách hiện tại dưới local
  refresh();
}
//Thêm đối tượng vào danh sách
function renderPersonel(data) {
  data = data || personnelList;
  var html = "";
  for (var i = 0; i < data.length; i++) {
    html += `<tr>
        <td>${data[i].account}</td>
        <td>${data[i].fullName}</td>
        <td>${data[i].email}</td>
        <td>${data[i].datepicker}</td>
        <td>${data[i].position}</td>
        <td>${data[i].totalSalary()}</td>
        <td>${data[i].categorize()}</td>
        <td><button 
        onclick="deletePersonnel('${data[i].account}')" 
        class="btn p-2 btn-outline-danger">Delete</button></td>
        <td><button data-toggle="modal"
        data-target="#myModal"
        onclick="getUpdatePersonnel('${data[i].account}')" 
        class="btn p-2 btn-outline-info">Modify</button></td>
    </tr>`;
  }
  document.getElementById("tableDanhSach").innerHTML = html;
}
function savePersonnelList() {
  // convert mảng personnelList thành chuỗi
  var personnelListJson = JSON.stringify(personnelList);
  localStorage.setItem("SL", personnelListJson);
}

function getPersonnelList() {
  var personnelListJson = localStorage.getItem("SL");
  // Kiểm tra Local không có data (personnelList = null) thì return
  if (!personnelListJson) return;
  // Chuyển Json về lại Object
  return JSON.parse(personnelListJson);
}
//input: datalocal
//output: new data
function mapPersonnelList(local) {
  var result = [];
  for (var i = 0; i < local.length; i++) {
    var olddata = local[i];
    var newdata = new Personnel(
      olddata.account,
      olddata.fullName,
      olddata.email,
      olddata.password,
      olddata.datepicker,
      olddata.salary,
      olddata.position,
      olddata.workTime
    );
    result.push(newdata);
  }
  return result;
}

window.onload = function () {
  // Bỏ code muốn chạy khi load trang
  var personnelListFromLocal = getPersonnelList();
  personnelList = mapPersonnelList(personnelListFromLocal);
  renderPersonel();
};
// Xóa đối tượng
function deletePersonnel(account) {
  var index = findByAccount(account);
  if (index === -1) return alert("Tài khoản không hợp lệ");
  personnelList.splice(index, 1);
  renderPersonel();
  savePersonnelList();
}
// Tìm thông tin account
function findByAccount(account) {
  for (var i = 0; i < personnelList.length; i++) {
    if (personnelList[i].account === account) {
      return i;
    }
  }
  return -1; //Không tìm được
}

//Part 1: Chọn đối tượng muốn cập nhập và hiện lên input
function getUpdatePersonnel(account) {
  var index = findByAccount(account);
  if (index === -1) return alert("Tài khoản không hợp lệ");
  var personnel = personnelList[index];
  document.getElementById("tknv").value = personnel.account;
  document.getElementById("name").value = personnel.fullName;
  document.getElementById("email").value = personnel.email;
  document.getElementById("password").value = personnel.password;
  document.getElementById("datepicker").value = personnel.datepicker;
  document.getElementById("luongCB").value = personnel.salary;
  document.getElementById("chucvu").value = personnel.position;
  document.getElementById("gioLam").value = personnel.workTime;

  //disable input mã sinh viên
  document.getElementById("tknv").disabled = true;
}

//Part 2: Cho người dùng sửa trên form và nhấn nút cập nhật
function updatePersonnel() {
  if (!validateForm()) return;
  var account = document.getElementById("tknv").value;
  var fullName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var email = document.getElementById("password").value;
  var datepicker = document.getElementById("datepicker").value;
  var salary = document.getElementById("luongCB").value * 1;
  var position = document.getElementById("chucvu").value;
  var workTime = document.getElementById("gioLam").value * 1;

  var index = findByAccount(account);
  var personnel = personnelList[index];

  personnel.fullName = fullName;
  personnel.email = email;
  personnel.datepicker = datepicker;
  personnel.salary = salary;
  personnel.position = position;
  personnel.workTime = workTime;

  renderPersonel();
  savePersonnelList();
  refresh();
}

function refresh() {
  document.getElementById("form").reset();
  document.getElementById("tknv").disabled = false;
}

function searchPersonnel(e) {
  var keyword = e.target.value.toLowerCase().trim();
  var result = [];

  for (var i = 0; i < personnelList.length; i++) {
    var personenlCategorize = personnelList[i].categorize().toLowerCase();
    if (personenlCategorize.includes(keyword)) {
      result.push(personnelList[i]);
    }
  }
  renderPersonel(result);
}
// Check giá trị bỏ trống
function required(val, config) {
  if (val.length > 0) {
    document.getElementById(config.errorInfo).innerHTML = "";
    return true;
  }
  document.getElementById(config.errorInfo).innerHTML = "*Vui lòng nhập lại";
  return false;
}
// Check độ dài kí tự
function length(val, config) {
  if (val.length < config.min || val.length > config.max) {
    document.getElementById(config.errorInfo).innerHTML =
      "*Vui lòng nhập tối đa 4 đến 6 kí tự";
    return false;
  }
  document.getElementById(config.errorInfo).innerHTML = "";
  return true;
}

function pattern(val, config) {
  if (config.regexp.test(val)) {
    document.getElementById(config.errorInfo).innerHTML = "";
    return true;
  }
  document.getElementById(config.errorInfo).innerHTML =
    "*Vui lòng nhập đúng giá trị";
  return false;
}

function validateForm() {
  var account = document.getElementById("tknv").value;
  var fullName = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var datepicker = document.getElementById("datepicker").value;
  var salary = document.getElementById("luongCB").value * 1;
  var position = document.getElementById("chucvu").value;
  var wordTime = document.getElementById("gioLam").value * 1;

  var testRegexpFullName =
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/g;
  var testRegexpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  var testRegexpPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/g;
  var testRegexpDate =
    /^(((0)[0-9])|((1)[0-2]))(\/)([0-2][0-9]|(3)[0-1])(\/)\d{4}$/g;

  var accountValid =
    required(account, { errorInfo: "tbTKNV" }) &&
    length(account, { errorInfo: "tbTKNV", min: 1, max: 6 });
  var fullNameValid =
    required(fullName, { errorInfo: "tbTen" }) &&
    pattern(fullName, { errorInfo: "tbTen", regexp: testRegexpFullName });

  var emailValid =
    required(email, { errorInfo: "tbEmail" }) &&
    pattern(email, { errorInfo: "tbEmail", regexp: testRegexpEmail });

  var passwordValid =
    required(password, { errorInfo: "tbMatKhau" }) &&
    pattern(password, { errorInfo: "tbMatKhau", regexp: testRegexpPassword });

  var datepickerValid =
    required(datepicker, { errorInfo: "tbNgay" }) &&
    pattern(datepicker, { errorInfo: "tbNgay", regexp: testRegexpDate });

  var isFormValid =
    accountValid &&
    fullNameValid &&
    emailValid &&
    passwordValid &&
    datepickerValid;

  return isFormValid;
}
