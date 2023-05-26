import { Component,OnInit } from '@angular/core';
import { LineBreakTransformer } from './LineBreakTransformer';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit{
  title = 'configurator';
  reader: any;
  writer: any;
  isConnnected=false;
  configuration: { [key: string]: any } = {
               'pusher_pull_time': 60,
               'pusher_push_time': 55,
               'esc_max_power': 1650,
               'min_rampup_time':140,
               'spin_differential':150,
               'inactivity_time_out':30,
               'warning_vbat':10,
               'critical_vbat':9,
               'vbat_scale':12,
             };

isSingleShot:any;
isBurstShots:any;
isFullAuto:any;

 ngOnInit() {

 }

 //Web serial doc: https://web.dev/serial/

async forward(event: Event) {
    await this.writer.write("speed:0.1 0.1\n");
    console.log("forward");
}

async backward(event: Event) {
  await this.writer.write("speed:-0.3 -0.3\n");
  console.log("backward");
}

async left(event: Event) {
  await this.writer.write("speed:0.3 -0.3\n");
  console.log("left");
}

async right(event: Event) {
  await this.writer.write("speed:-0.3 0.3\n");
  console.log("right");
}

async arm(event: Event) {
  await this.writer.write("arm\n");
  console.log("arm");
}

async halt(event: Event) {
  await this.writer.write("halt\n");
  console.log("halt");
}



async connect(event: Event) {
  let webSerial: any;
  webSerial = window.navigator;

if (webSerial && webSerial.serial) {

    // Filter on devices with the Arduino Uno USB Vendor/Product IDs.
    const filters = [
      { usbVendorId: 9025 }
    ];
    // Prompt user to select an Arduino Uno device.
    //const port = await webSerial.serial.requestPort({ filters });

    const port = await webSerial.serial.requestPort();


    const { usbProductId, usbVendorId } = port.getInfo();
    console.log(usbVendorId);

    await port.open({ baudRate: 115200,databits: 8,  stopbits: 1, parity: "none" ,flowControl: "none"});

    //const [appReadable, devReadable] = port.readable.tee();

    //const textDecoder = new TextDecoderStream();
    //const readableStreamClosed = appReadable.pipeTo(textDecoder.writable);
    //this.reader = textDecoder.readable.pipeThrough(new TransformStream(new LineBreakTransformer())).getReader();


    const textEncoder = new TextEncoderStream();
    const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
    this.writer = textEncoder.writable.getWriter();

    this.isConnnected=true;
    webSerial.serial.addEventListener("disconnect", (event:any) => {
        this.isConnnected=false;
    });

    //await writer.write("hello");


//const textEncoder = new TextEncoderStream();
//const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

//reader.cancel();
//await readableStreamClosed.catch(() => { /* Ignore the error */ });

//writer.close();
//await writableStreamClosed;

//await port.close();

while (port.readable) {
  const reader = port.readable.getReader();
  const decoder = new TextDecoder("utf-8");
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        console.log("done");
        break;
      }
      
      console.log(decoder.decode(value));
    }
  } catch (error) {
    // Handle |error|...
  } finally {
    reader.releaseLock();
  }
}
console.log("disconnected");



} else {
  alert('Serial not supported');
}

}





}

