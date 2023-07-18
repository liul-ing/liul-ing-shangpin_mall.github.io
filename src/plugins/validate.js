// vee-validate插件，进行表单验证
import Vue from "vue";
import VeeValidate from "vee-validate";
import zh_CN from "vee-validate/dist/locale/zh_CN";
Vue.use(VeeValidate);

//表单验证
VeeValidate.Validator.localize("zh_CN", {
  //用中文提示显示信息
  messages: {
    ...zh_CN.messages,
    is: (field) => `${field}必须与密码相同`, //修改内置规则的message，让确认密码和密码相同
  },
  //要校验的字段
  attributes: {
    //给校验的field属性名映射中文名
    phone: "手机号",
    code: "校验码",
    password: "密码",
    password1: "确认密码",
    agree: "协议",
  },
});

//自定义规则 agree是自定义规则的名字
VeeValidate.Validator.extend("agree", {
  validate: (value) => {
    return value;
  },
  getMessage: (field) => field + "必须同意",
});
