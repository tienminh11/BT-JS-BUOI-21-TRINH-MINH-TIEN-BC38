// Tạo lớp đối tượng
function Personnel(
  account,
  fullName,
  email,
  password,
  datepicker,
  salary,
  position,
  wordTime,

) {
  this.account = account;
  this.fullName = fullName;
  this.email = email;
  this.password = password;
  this.datepicker = datepicker;
  this.salary = salary;
  this.position = position;
  this.workTime = wordTime;

  this.totalSalary = function () {
    if (this.position === "Sếp") {
      return (this.salary * 3);
    } else if (this.position === "Trưởng phòng") {
      return (this.salary * 2);
    } else if (this.position === "Nhân viên") {
      return this.salary;
    }
  };
  this.categorize = function () {
    if (this.workTime >= 192 && this.position === "Nhân viên") {
      return ("Nhân viên xuất sắc");
    } else if (this.workTime >= 176 && this.position === "Nhân viên") {
      result = "Nhân viên giỏi ";
    } else if (this.workTime >= 160 && this.position === "Nhân viên") {
      return ("Nhân viên khá ");
    } else if (this.workTime < 160 && this.position === "Nhân viên") {
      return ("Nhân viên trung bình ");
    } else {
      return ("");
    }
  };
}
