var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
var selectorRules = {};
// Xử lý báo lỗi
function validate(rule, inputElement, formGroup, errorElement) {
  var errorMessage;
  var rules = selectorRules[rule.selector];
  for (let i = 0; i < rules.length; i++) {
    errorMessage = rules[i](inputElement.value);
    if (errorMessage) break;
  }
  if (errorMessage) {
    errorElement.innerText = errorMessage;
    formGroup.classList.add("invalid");
  } else {
    errorElement.innerText = "";
    formGroup.classList.remove("invalid");
  }
  // Trả về true khi input có lỗi
  return errorMessage;
}
function Validator(option) {
  const form = $(option.form);
  if (form) {
    // Validate all input để điều kiện thì mới cho submit

    form.onsubmit = (e) => {
      // Chặn lại submit mặc định trình duyệt để có thể fetch API bằng JS
      e.preventDefault();
      var isInValid = true;
      var i = 0;
      var isValid = true;
      option.rules.forEach((rule) => {
        var inputElement = form.querySelector(rule.selector);
        var formGroup = inputElement.parentElement;
        var errorElement = formGroup.querySelector(option.errorSelector);
        isInValid = validate(rule, inputElement, formGroup, errorElement);
        // chỉ cần có 1 lỗi là sẽ gán cho form lỗi ngay
        if (isInValid && i == 0) {
          isValid = false;
          i++;
        }
      });
      // Khi form nhập vào không có lỗi nào.
      if (isValid) {
        // Trả về dữ liêu người dùng
        if (typeof option.onSubmit === "function") {
          var enableInput = form.querySelectorAll("[name]:not([disabled])");
          var formValues = Array.from(enableInput).reduce((values, input) => {
            values[input.name] = input.value || null;
            return values;
          }, {});
          option.onSubmit(formValues);
        } else {
          // Chỉ để validate bằng js và cho submit để dùng API bằng PHP
          console.log(1);
          form.submit();
        }
      }
    };
    // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện blur, input, ...)
    option.rules.forEach((rule) => {
      // Lưu lại rule không để rule ghi đè nhau
      if (Array.isArray(selectorRules[rule.selector]))
        selectorRules[rule.selector].push(rule.test);
      else selectorRules[rule.selector] = [rule.test];

      var inputElement = form.querySelector(rule.selector);
      var formGroup = inputElement.parentElement;
      var errorElement = formGroup.querySelector(option.errorSelector);
      //   Khi blur ra input
      inputElement.onblur = () => {
        validate(rule, inputElement, formGroup, errorElement);
      };
      //   Khi người dùng nhập vào input
      inputElement.oninput = () => {
        errorElement.innerText = "";
        formGroup.classList.remove("invalid");
      };
    });
  }
}

// Kiểm tra giá trị
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Vui lòng nhập trường này";
    },
  };
};
Validator.isEmail = (selector, message) => ({
  selector,
  test(value) {
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(value)
      ? undefined
      : message || "Trường này phải là email";
  },
});
Validator.minLength = (selector, min, message) => ({
  selector,
  test(value) {
    return value.length >= min
      ? undefined
      : message || `Mật khẩu ít nhất ${min} kí tự`;
  },
});

Validator.isConfirm = (selector, message) => ({
  selector,
  test(value) {
    return value === document.querySelector("#password").value
      ? undefined
      : message || "Giá trị không chính xác";
  },
});
