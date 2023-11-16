namespace ESP8266Smarteo {
    
    function sendAT(command : string, wait : number = 0) {
        serial.writeString(command + "\u000D\u000A")
        basic.pause(wait)
    }

    function resetESP() {
        let response = ""
        do {
            sendAT("AT+RESTORE", 1000) // restore to factory settings
            sendAT("AT+RST", 1000) // reset the module
            sendAT("AT", 500) // test command
            response = serial.readString()
            if (response.includes("OK")) {
                basic.showIcon(IconNames.Yes)
                break // Sortir de la boucle si la réponse est OK
            } else {
                basic.showIcon(IconNames.No)
                basic.pause(1000) // Attendre avant de réessayer
            }
        } while (true) // Boucle infinie jusqu'à ce que la condition soit remplie
        sendAT("AT+CWMODE=1", 500) // set to station mode
    }
    
    /**
     * Initialize ESP8266 module
     */
    //% block='set ESP8266 Tx %tx Rx %rx Baudrate %baudrate'
    //% tx.defl='SerialPin.P14'
    //% rx.defl='SerialPin.P0'
    //% baudrate.defl='baudrate.BaudRate115200'
    export function initesp8266(tx : SerialPin, rx : SerialPin, baudrate : BaudRate) {
            serial.redirect(tx, rx, BaudRate.BaudRate115200)
            serial.setTxBufferSize(128)
            serial.setRxBufferSize(128)
            sendAT("AT", 500)
            let test = serial.readString()
            if (test.includes("OK")) {
                basic.showIcon(IconNames.Yes)
                basic.pause(1000)
            }
            else {
                basic.showIcon(IconNames.No)
                basic.pause(1000)
            } 
        resetESP()
    }
    

    /**
     * Connect to Wifi router
     */
    //% block='Connect Wifi SSID %ssid password %password ip address %ip_address'
    //% ssid.defl='Smarteo'
    //% password.defl='%Smarteo123'
    //% ip_address.defl='192.168.1.30'
    export function connectToWifi(ssid : string, password : string, ip_address : string) {
        sendAT(`AT+CWJAP="${ssid}","${password}"`, 5000)
        sendAT("AT+CWJAP?",5000)
        let response = serial.readString()
        if (response.includes("NO AP")) {
            basic.showIcon(IconNames.Angry)
        }
        else {
            basic.showIcon(IconNames.Happy)
        }
    }

}
