 
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
    code varchar(64)  ,
    adress varchar(600),
    landlord varchar(32),
    tel varchar(32),
    area_min DECIMAL(15,2) ,
    area_max DECIMAL(15,2) ,
    area_unit varchar(32) ,
    building varchar(32)  ,
    
    floor varchar(32),
    price_min DECIMAL(15,2),
    price_max DECIMAL(15,2),
    price_unit varchar(32) ,
    voltage varchar(32) ,
    remark varchar(1000),
    source varchar(32)  ,
    entrust varchar(32),
    source_time datetime ,
    sold varchar(1)  ,
    sell_time datetime  
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
    code varchar(32) ,
    name varchar(64)  ,
    business varchar(200),
    tel varchar(32),
    area_min DECIMAL(15,2) ,
    area_max DECIMAL(15,2) ,
    area_unit varchar(32) ,
    site varchar(32)  ,
    floor varchar(32),
    price_min DECIMAL(15,2),
    price_max DECIMAL(15,2),
    price_unit varchar(32) ,
    remark varchar(1000),
    source varchar(32)  ,
    source_time datetime ,
    lose varchar(1)  ,
    lose_time datetime  
    )`, err => {
    logger(err);
  });
});

export default db;