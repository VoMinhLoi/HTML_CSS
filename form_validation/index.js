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
}
function Validator(option) {
  const form = $(option.form);
  if (form) {
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

Validator.isConfirm = (selector, preValue, message) => ({
  selector,
  test(value) {
    return value === preValue
      ? undefined
      : message || "Giá trị không chính xác";
  },
});
