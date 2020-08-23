 
import fse from 'fs-extra';
import path from 'path';
import sq3 from 'sqlite3';
import logger from './logger';
import { docDir } from './settings';
// 将数据存至系统用户目录，防止用户误删程序
export const dbPath = path.join(docDir, 'data.sqlite3');
fse.ensureFileSync(dbPath);

const sqlite3 = sq3.verbose();
const db = new sqlite3.Database(dbPath);
db.serialize(() => {
  /**
   * 房源表 house
   */
  // db.run(`CREATE TABLE HOUSE  (
  //   id INTEGER PRIMARY KEY AUTOINCREMENT  NOT NULL,
  //   create_by varchar(50) ,
  //   create_time datetime  ,
  //   update_by varchar(50) ,
  //   update_time datetime  ,
  //   code varchar(64)  ,
  //   adress varchar(600),
  //   landlord varchar(32),
  //   tel varchar(32),
  //   area DECIMAL(10,2) ,
  //   area_unit varchar(32) ,
  //   building varchar(32)  ,
  //   floor varchar(32),
  //   price DECIMAL(10,2),
  //   price_unit varchar(32) ,
  //   voltage varchar(32) ,
  //   remark varchar(1000),
  //   source varchar(32)  ,
  //   source_time datetime ,
  //   sold varchar(1)  ,
  //   sell_time datetime  
  //   )`, err => {
  //   logger(err);
  // });
  /**
   * 房源表 house
   */
  db.run(`CREATE TABLE HOUSE  (
    id INTEGER PRIMARY KEY AUTOINCREMENT  NOT NULL,
    create_by varchar(50) ,
    create_time datetime  ,
    update_by varchar(50) ,
    update_time datetime  ,
    code varchar(64)  ,  -- 编码
    adress varchar(600),  -- 地址
    landlord varchar(32),  -- 
    tel varchar(32),  -- 电话
    area_min DECIMAL(15,2) ,  -- 面积最小
    area_max DECIMAL(15,2) ,  -- 面积最大
    area_unit varchar(32) ,  -- 面积单位
    building varchar(32)  ,  -- 楼号
    floor varchar(32),  -- 楼层
    price_min DECIMAL(15,2),  -- 价格最低
    price_max DECIMAL(15,2),  -- 价格最高
    price_unit varchar(32) ,  -- 价格单位
    voltage varchar(32) ,  -- 电压
    remark varchar(1000), -- 备注
    source varchar(32)  ,  -- 来源
    entrust varchar(32),  -- 
    source_time datetime ,  -- 来源时间
    sold varchar(1)  ,  --  租出标志
    sell_time datetime    -- 租出时间
    )`, err => {
    logger(err);
  });
  /**
   * 客户表 CUSTOMER
   */
  db.run(`CREATE TABLE CUSTOMER  (
    id INTEGER PRIMARY KEY AUTOINCREMENT  NOT NULL,
    create_by varchar(50) ,
    create_time datetime  ,
    update_by varchar(50) ,
    update_time datetime  ,
    code varchar(32) ,  -- 编码
    name varchar(64)  ,  -- 名称
    business varchar(200),  -- 用途
    tel varchar(32),  -- 电话
    area_min DECIMAL(15,2) ,  -- 面积最小
    area_max DECIMAL(15,2) ,  -- 面积最大
    area_unit varchar(32) ,  -- 面积单位
    site varchar(32)  ,  -- 位置
    floor varchar(32),  -- 楼层
    price_min DECIMAL(15,2),  -- 价格最低
    price_max DECIMAL(15,2),  -- 价格最高
    price_unit varchar(32) ,  -- 价格单位
    remark varchar(1000),  -- 备注
    source varchar(32)  ,  -- 来源
    source_time datetime ,  -- 来源时间
    lose varchar(1)  ,  --失效
    lose_time datetime    -- 失效时间
    )`, err => {
    logger(err);
  });
  /**
   * 带看记录表
   */
  db.run(`CREATE TABLE TAKE_LOOK  (
    id INTEGER PRIMARY KEY AUTOINCREMENT  NOT NULL,
    create_by varchar(50) ,
    create_time datetime  ,
    update_by varchar(50) ,
    update_time datetime  ,
    code varchar(32) ,  --编码
    customer_id INTEGER  , -- 客户id
    house_id INTEGER, -- 房源id
    take_time datetime,  -- 带看时间
    evaluate varchar(200)  , -- 评价
    request varchar(200),  -- 要求
    remark varchar(1000)  -- 备注
   
    )`, err => {
    logger(err);
  });
});

export default db;