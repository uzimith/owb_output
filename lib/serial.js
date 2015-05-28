/* Serial for Open Web Board JavaScript framework, version 0.1
 * (c) 2014 KDDI CORPORATION
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *--------------------------------------------------------------------------*/

var TCPSerial = function() {
  this.host = "";
  this.port = "";

  this.bitrate = 9600;
  this.devicename = "ttyUSB0";

  this.onread = null;
  this.onopen = null;

  this.socket = null;
};

function seriallog(mes) {
  console.log(mes)
};

TCPSerial.prototype = {
  // set serial port params
  setParams: function( devicename, bitrate ) {
    seriallog( "SERIAL: " + devicename + ", " + bitrate );

    this.devicename = devicename;
    this.bitrate = bitrate;
  },

  // connect to seriald
  connect: function( host, port ) {
    this.host = host;
    this.port = port;

    seriallog("SERIAL Connecting: " + this.host +":"+this.port);

    this.socket = navigator.mozTCPSocket.open( this.host, this.port );

    // send command to seriald after connected
    this.socket.onopen = function() {
      seriallog("TCP Connected to seriald");

      var command = { "devicename": this.devicename, 
        "bitrate": this.bitrate };
      var ret = this.socket.send(JSON.stringify(command));

      if (this.onopen) {
        this.onopen();
      }
    }.bind(this);


    // get message from seriald
    this.socket.ondata = function(msg) {
      if(this.onread) {
        this.onread(msg.data);
      }
    }.bind(this);

    // OnError
    this.socket.onerror = function(e) {
      seriallog( "SERIAL: onerror:" );
      seriallog( e );
    }.bind(this);

    // OnClose
    this.socket.onclose = function(e) {
      seriallog( "SERIAL: onclose is called" );
      this.socket = null;
    }.bind(this);

  },

  send: function(msg) {
    var ret = this.socket.send(msg);
    return ret;
  },

  disconnect: function() {
    if (this.socket) {
      this.socket.close();
    }
  }

};
