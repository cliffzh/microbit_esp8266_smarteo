namespace ESP8266Smarteo {
    
    function sendAT(command : string, wait : number = 0) {
        serial.writeString(`${command}\u000D\u000A`)
        basic.pause(wait)
    }

    function resetESP() {
        sendAT("AT+RESTORE", 1000) // restore to factory settings
        sendAT("AT+RST", 1000) // reset the module
        sendAT("AT+CWMODE=1", 500) // set to station mode
    }

    function isConnectedWiFi() : boolean {
        sendAT("AT+CWJAP?", 5000)
        let response = serial.readString()
        return response.includes("NO AP") == false
    }
    
    /**
     * Initialize ESP8266 module
     */
    //% block='set ESP8266 RX %rx TX %tx Baudrate %baudrate'
    //% tx.defl='SerialPin.P14'
    //% rx.defl='SerialPin.P0'
    //% baudrate.defl='baudrate.BaudRate115200'
    export function initesp8266(tx : SerialPin, rx : SerialPin, baudrate : BaudRate) {
        try {
            serial.redirect(tx, rx, BaudRate.BaudRate115200)
            basic.pause(100)
            serial.setTxBufferSize(128)
            serial.setRxBufferSize(128)
            resetESP()
        }
        catch(e) {
            basic.showString("Erreur pins :" + e)
        }
            
    }

    /**
     * Connect to Wifi router
     */
    //% block='Connect Wifi SSID %ssid password %password ip address %ip_address'
    //% ssid.defl='Smarteo'
    //% password.defl='%Smarteo123'
    //% ip_address.defl='192.168.1.30'
    export function connectToWifi(ssid : string, password : string, ip_address : string) : boolean {
        sendAT(`AT+CWJAP="${ssid}","${password}"`, 5000)
        if(!isConnectedWiFi()) {
            basic.showString("echec du connexion wifi")
            return false
        }
        sendAT(`AT+CIPSTA="${ip_address}"`, 1000)
        return true
    }
 }
