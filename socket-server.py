"""Example 5: Play a windows sound when the shift-light comes on"""

import sys
import json
import pyinsim
import tornado.ioloop
import tornado.web
import tornado.websocket



latestPacket = "";

class RacingWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        print("WebSocket opened")

    def on_message(self, message):
        self.write_message("Hello!")
        #self.write_message(latestPacket)

    def on_close(self):
        print("WebSocket closed")

def to_JSON(packet):
    return json.dumps(packet, default=lambda o: o.__dict__, sort_keys=True, indent=4)

def outgauge_packet(outgauge, packet):
    print to_JSON(packet)
    latestPacket = to_JSON(packet)

app = tornado.web.Application([(r'/racing', RacingWebSocket)])
app.listen(8080)

#outgauge = pyinsim.outgauge('0.0.0.0', 10001, outgauge_packet, 30.0)

#pyinsim.run()
tornado.ioloop.IOLoop.instance().start()
