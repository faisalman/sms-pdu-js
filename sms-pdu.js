// SMSPDU.js v0.0.1
// https://github.com/faisalman/sms-pdu-js
//
// Copyright © 2013 Faisalman
// Dual licensed under GPLv2 & MIT

//////////////////////////////////////////////////
// TODO: use bit manipulation rather than string
/////////////////////////////////////////////////

(function (window, undefined) {

    'use strict';

    // see ftp://ftp.unicode.org/Public/MAPPINGS/ETSI/GSM0338.TXT
    var GSM7BIT_DECODE = ['@', '\u00A3', '$', '\u00A5', '\u00E8', '\u00E9', 
        '\u00F9', '\u00EC', '\u00F2', '\u00E7', '\n', '\u00D8', '\u00F8', '\r', 
        '\u00C5', '\u00E5', '\u0394', '_', '\u03A6', '\u0393', '\u039B', '\u03A9',
        '\u03A0', '\u03A8', '\u03A3', '\u0398', '\u039E', '\u00A0', '\u00C6', 
        '\u00E6', '\u00DF', '\u00C9', ' ', '!', '"', '#', '\u00A4', '%', '&', '\'', 
        '(', ')', '*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', 
        '7', '8', '9', ':', ';', '<', '=', '>', '?', '\u00A1', 'A', 'B', 'C', 
        'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 
        'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '\u00C4', '\u00D6', '\u00D1', 
        '\u00DC', '\u00A7', '\u00BF', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 
        'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 
        'y', 'z', '\u00E4', '\u00F6', '\u00F1', '\u00FC', '\u00E0'];

    var GSM7BIT_ENCODE = (function () {
        var map = {};
        GSM7BIT_DECODE.forEach(function (el, i) {
            map[el] = i; 
        });
        return map;
    })();

    var NUMBER_FORMAT = {
        BIN : 2,
        DEC : 10,
        HEX : 16
    };

    var Utils = {
        convert : function (string, from, to) {
            return parseInt(string, from).toString(to);
        },
        convertArray : function (array, from, to) {
            array.forEach(function (el, i) {
                var octet = Utils.convert(el, from, to);
                if (to === NUMBER_FORMAT.BIN && octet.length < 8) {
                    octet = ('0000000' + octet).substr(-8);
                }
                array[i] = octet;
            });
            return array;
        },
        split : function (string, format) {
            var unmatch, match;
            if (format === NUMBER_FORMAT.BIN) {
                unmatch = /[^01]/gi;
                match = /[01]{1,8}/gi;
            } else if (format === NUMBER_FORMAT.HEX) {
                unmatch = /[^0-9a-f]/gi;
                match = /[0-9a-f]{1,2}/gi;
            }
            return (string.replace(unmatch, '')).match(match);
        }
    };

    var SMSPDU = {
        decodeAs7bitGSM : function (hex) {
            var octetArray = Utils.convertArray(Utils.split(hex, NUMBER_FORMAT.HEX), NUMBER_FORMAT.HEX, NUMBER_FORMAT.BIN);
            // unpack to 7bit
            var septetArray = [];
            for (var i = 0; i < octetArray.length; i++) {
                var septet = octetArray[i].substr((i % 7) + 1);
                if (i == 0) {
                    septetArray.push(septet);
                } else {
                    septet += octetArray[i - 1].substr(0, i % 7);
                    septetArray.push(septet);
                    if ((i > 1) && ((i + 1) % 7 === 0)) {
                        septet = octetArray[i].substr(0, 7);
                        septetArray.push(septet);
                    }
                }
            }
            var charArray = [];
            septetArray.forEach(function (el, i) {
                // map to gsm char
                charArray[i] = GSM7BIT_DECODE[parseInt(el, NUMBER_FORMAT.BIN)];
            });
            return charArray.join('');
        },
        encodeAs7bitGSM : function (chars) {
            throw new Error('UNIMPLEMENTED_METHOD');
        }
    };

    // check js environment 
    if (typeof exports !== 'undefined' && !/\[object\s[DOM]*Window\]/.test(global.toString())) {
        // nodejs env
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = SMSPDU;
        }
        exports.SMSPDU = SMSPDU;
    } else if (typeof define === FUNC && define.amd) {
        // requirejs env
        define(function() {
            return SMSPDU;
        });
    } else {
        // browser env
        window.SMSPDU = SMSPDU;
    }

})(this);
