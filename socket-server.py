import sys
import json
import pyinsim
import tornado.ioloop
import tornado.web
import tornado.websocket
from threading import Thread



latestPacket = "";

class RacingWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        print("WebSocket opened")

    def on_message(self, message):
        global latestPacket
        self.write_message(latestPacket)

    def on_close(self):
        print("WebSocket closed")

    def check_origin(self, origin):
        return True 

def to_JSON(packet):
    return json.dumps(packet, default=lambda o: o.__dict__, sort_keys=True, indent=4)

def outgauge_packet(outgauge, packet):
    global latestPacket 
    latestPacket = to_JSON(packet)

app = tornado.web.Application([(r'/racing', RacingWebSocket)])
app.listen(8080)

outgauge = pyinsim.outgauge('0.0.0.0', 10001, outgauge_packet, 30.0)

def outgauge_init():
    pyinsim.run()

def tornado_init():
    tornado.ioloop.IOLoop.instance().start()

outgauge_thread = Thread(target = outgauge_init)
tornado_thread = Thread(target = tornado_init)

outgauge_thread.start()
tornado_thread.start()

while (True):
    input = raw_input("cmd: ");
    if (input == "stop"):
        pyinsim.closeall()
        tornado.ioloop.IOLoop.instance().stop()
        break
