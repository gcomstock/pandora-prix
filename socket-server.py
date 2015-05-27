#!/usr/bin/env python
import signal
import sys
import json
import pyinsim
import tornado.ioloop
import tornado.web
import tornado.websocket
from threading import Thread

latestPacket = ""
running = True

class RacingWebSocket(tornado.websocket.WebSocketHandler):
    def on_message(self, message):
        global latestPacket
        self.write_message(latestPacket)

    def check_origin(self, origin):
        return True 

def to_JSON(packet):
    return json.dumps(packet, default=lambda o: o.__dict__, sort_keys=True, indent=4)

def outgauge_packet(outgauge, packet):
    global latestPacket
    latestPacket = to_JSON(packet)

app = tornado.web.Application([(r'/racing', RacingWebSocket)])
app.listen(8080)



def outgauge_init():
    while (running):
        outgauge = pyinsim.outgauge('0.0.0.0', 10001, outgauge_packet, 2.0)
        pyinsim.run()
        print "Connection Closed, Retrying"

def tornado_init():
    tornado.ioloop.IOLoop.instance().start()

outgauge_thread = Thread(target = outgauge_init)
tornado_thread = Thread(target = tornado_init)

outgauge_thread.start()
tornado_thread.start()

def signal_handler(signal, frame):
        global running
        running = False
        pyinsim.closeall()
        tornado.ioloop.IOLoop.instance().stop()
        sys.exit(0)
signal.signal(signal.SIGINT, signal_handler)
print("Press Control-C to exit")
signal.pause()

