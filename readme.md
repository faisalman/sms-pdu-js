# SMSPDU.js

SMS PDU library written in JavaScript

## Example

### Using browser

```html
<script type="text/javascript" src="sms-pdu.js"></script>
<script type="text/javascript">
    var message = 'C8329BFD66818CE1F43CCC6E87DD21'; // 8bit hex representation from SMS-DELIVER TP-UD
    console.log(SMSPDU.decodeAs7bitGSM(message));   // Hello, World!
</script>
```

### Using nodejs

```js
var SMSPDU = require('./sms-pdu');
var message = 'C8329BFD66818CE1F43CCC6E87DD21';
console.log(SMSPDU.decodeAs7bitGSM(message));
```

## License

MIT License

Copyright © 2013 Faisalman <<fyzlman@gmail.com>>
