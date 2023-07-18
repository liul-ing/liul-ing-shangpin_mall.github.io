// 封装游客身份模块，利用uuid插件--》生成一个随机字符串且每次执行不能发生变化，游客身份持久存储
import { v4 as uuidv4 } from "uuid";
export const getUUID = () => {
  //先从本地存储里是否有，有则直接获取，没有则生成一个
  let uuid_token = localStorage.getItem("UUIDTOKEN");
  //如果没有
  if (!uuid_token) {
    // 生成临时身份
    uuid_token = uuidv4();
    // 本地存储
    localStorage.setItem("UUIDTOKEN", uuid_token);
  }
  return uuid_token;
};
