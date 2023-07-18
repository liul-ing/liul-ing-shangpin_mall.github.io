import Mock from "mockjs"; //引入mockjs模块
//引入Json数据  webpack默认对外暴露的：图片与JSON数据格式

import banner from "./banner.json";
import floor from "./floor.json";

//mock数据 第一个参数是请求地址，第二个参数是请求的数据
Mock.mock("/mock/banner", { code: 200, data: banner }); //轮播图数据
Mock.mock("/mock/floor", { code: 200, data: floor }); //家用电器部分数据
