const  formValidator = (props) => {
    let fields = props;
    const emailPattern = RegExp(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    );
  
    const formValid = function (errors) {
      let valid = true;
      Object.values(errors).map(function (value) {
        value.length !== 0 && (valid = false);
      });
  
      return valid;
    };
  
    const onHandleSubmit = (event) => {
      event.preventDefault();
      let errors = fields.errors;
      
      Object.keys(errors).map((error, index) => {
        if(event.target[error] !== undefined && fields[error] !== null)
          validate(
            error,
            (event.target[error].placeholder === undefined) ? (event.target[error][0].placeholder === undefined ? event.target[error].options[0].innerHTML : event.target[error][0].placeholder) : event.target[error].placeholder,
            fields[error],
            (event.target[error].type === undefined) ? event.target[error][0].type : event.target[error].type,
            fields.errors
          );
      });
  
      if (formValid(errors)) {
        if (props.mode === "I") resetForm(event);
        return true;
      } else {
        let errors = fields.errors;
  
        Object.keys(errors).every(function (key) {
          if (errors[key].length > 0) {
            const type = event.target[key].type;
            if(type === "radio")
              event.target[key][0].focus();
            else
              event.target[key].focus();
            return false;
          }else {
            return true;
          }
        });
        
        return false;
      }
    };
  
    const doValidate = (event) => {
      const { name, placeholder, value, type } = event.target;
      let errors = fields.errors;
      if (type === "select-multiple") {
        let optionValue = Array.from(
          event.target.selectedOptions,
          (option) => option.value
        );
        validate(name, 
          (placeholder === undefined) ? (event.target.options[0].innerHTML) : placeholder, 
          optionValue, 
          type, 
          errors
        );
      } 
      else if (type === "file") {
        let fileDescriptor = event.target.files[0];
        validate(name, 
          (placeholder === undefined || placeholder === '') ? (event.target.files[0].name) : placeholder, 
          fileDescriptor, 
          type, 
          errors
        );
      }
      else if (type === "checkbox") {
        let checkboxValue = event.target.checked;
        validate(name, placeholder, checkboxValue, type, errors);
      }
      else validate(name, placeholder, value, type, errors);
    }
  
    const onHandleChange = (event) => {
      doValidate(event);
    };
  
    const onHandleBlur = (event) => {
      doValidate(event);
    };
  
    const onHandleFileUpload = (event) => {
      doValidate(event);
    }
  
    const validate = (name, placeholder, value, type, errors) => {
      switch (type) {
        case "text":
        case "number":
        case "password":
        case "textarea":
          if(props.errors.hasOwnProperty(name)) {
            errors[name] =
              value.length == 0
                ? `The ${placeholder ?? name} field is required`
                : "";
          }
          break;
        case "select-one":
        case "select-multiple":
          console.log(name, value);
          if(props.errors.hasOwnProperty(name)) {
            errors[name] =
              value.length == 0
                ? `The ${document.forms[0].elements[name].options[0].innerHTML ?? name} field is required`
                : "";
          }
          break;
        case "checkbox":
        case "radio":
          if(props.errors.hasOwnProperty(name)) {
            errors[name] = (document.querySelector(`input[type=${type}]:checked`) === null)
            ? `The ${placeholder ?? name} field is required`
            : "";
          }
          break;
        case "email":
          if(props.errors.hasOwnProperty(name)) {
            errors[name] =
              value.length == 0 
                ? `The ${placeholder ?? name} field is required`
                : (!emailPattern.test(value)
                  ? "The Email is invalid!"
                  : ""
                );
          }
          break;
        case "file":
          if(props.errors.hasOwnProperty(name)) {
            errors[name] = 
              value.length == 0 
                ? `The ${placeholder ?? name} field is required`
                :
                ""
          }
        default:
          break;
      }

      fields = {
        ...fields,
        [name]: value,
        errors
      }
    };
  
    const resetForm = (event) => {
      Object.keys(fields).forEach((field) => {
        if (event.target[field] !== undefined) {
          if(event.target[field].checked){
            event.target[field].checked = false;
          }
          event.target[field].value = "";
          fields = {
            ...props,
            [field]: ''
          }
        }
      });
    };
  
    return {
      onHandleChange,
      onHandleSubmit,
      onHandleBlur,
      onHandleFileUpload,
      fields,
    };
  }
  
  module.exports = {
    formValidator
  }