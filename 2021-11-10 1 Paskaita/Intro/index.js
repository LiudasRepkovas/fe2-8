import {hello} from './modulis.js';
import os from 'os';
import _ from 'lodash';

const userInfo = os.userInfo();

console.log(userInfo);

const userName = userInfo.username;

hello(userName);

const masyvas = ['PAKEICIAU', 'vienas', 2, 2, 'vienas', 3, 'trys'];
const beVienodu = _.uniq(masyvas);
console.log(beVienodu);