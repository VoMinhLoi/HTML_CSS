var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);
function validate(rule, inputElement, formGroup, errorElement) {
  var errorMessage = rule.test(inputElement.value);
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
    console.log(preValue);
    return value === preValue
      ? undefined
      : message || "Giá trị không chính xác";
  },
});
