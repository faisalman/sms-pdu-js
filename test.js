var SMSPDU = require('./sms-pdu');
var message = 'C8329BFD66818CE1F43CCC6E87DD21';         // 8bit hex representation from SMS-DELIVER TP-UD
console.log(SMSPDU.decodeAs7bitGSM(message));           // Hello, World!
//console.log(SMSPDU.encodeAs7bitGSM('Hello, World!'));
