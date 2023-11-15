namespace ESP8266Smarteo {
    
    function sendAT(command : string, wait : number = 0) {
        serial.writeString(`${command}\u000D\u000A`)
        basic.pause(wait)
    }

    function resetESP() {
        sendAT("AT+RESTORE", 1000) // restore to factory settings
        sendAT("AT+RST", 1000) // reset the module
        let response = serial.readString()
        console.log(response)
        sendAT("AT+CWMODE=1", 500) // set to station mode
        basic.showNumber(1)
        basic.pause(3000)
    }
    
    /**
     * Initialize ESP8266 module
     */
    //% block='set ESP8266 RX %rx TX %tx Baudrate %baudrate'
    //% tx.defl='SerialPin.P14'
    //% rx.defl='SerialPin.P0'
    //% baudrate.defl='baudrate.BaudRate115200'
    export function initesp8266(tx : SerialPin, rx : SerialPin, baudrate : BaudRate) {
        serial.redirect(tx, rx, BaudRate.BaudRate115200)
        basic.showNumber(0)
        basic.pause(100)
        serial.setTxBufferSize(128)
        serial.setRxBufferSize(128)
        resetESP()
    }

    /**
     * Connect to Wifi router
     */
    //% block='Connect Wifi SSID %ssid password %password ip address %ip_address'
    //% ssid.defl='Smarteo'
    //% password.defl='%Smarteo123'
    //% ip_address.defl='192.168.1.30'
    export function connectesp8266(ssid : string, password : string, ip_address : string) {
        sendAT(`AT+CWJAP="${ssid}","${password}"`)
        let response2 = serial.readString()
        console.log(response2)
        basic.showNumber(2)
        basic.pause(2000)
        sendAT(`AT+CIPSTA="${ip_address}"`, 1000)
        basic.showNumber(3)
        basic.pause(2000)
    }
 }
