#!/usr/bin/env python
import signal
import sys
import json
import pyinsim
import tornado.ioloop
import tornado.web
import tornado.websocket
from threading import Thread
import Queue
import time

websockets = []
insimQueue = Queue.Queue()
outGaugePacket1 = ""
outGaugePacket2 = ""
outSimPacket1 = ""
outSimPacket2 = ""
running = True
insim = None

class RacingWebSocket(tornado.websocket.WebSocketHandler):

    def on_message(self, message):
	global outGaugePacket1
	global outGaugePacket2
	global outSimPacket1
	global outSimPacket2
        self.write_message(outGaugePacket1)
	outGaugePacket1 = ""
        self.write_message(outGaugePacket2)
	outGaugePacket2 = ""
        self.write_message(outSimPacket1)
	outSimPacket1 = ""
        self.write_message(outSimPacket2)
	outSimPacket2 = ""

        if (not insimQueue.empty()):
            self.write_message(insimQueue.get(False))


    def check_origin(self, origin):
        return True 

def to_JSON(packet):
    return json.dumps(packet, default=lambda o: o.__dict__, sort_keys=True, indent=4)

def outgauge_packet(outgauge, packet):
    global outGaugePacket1
    global outGaugePacket2
    
    if packet.ID[0] == 1:
        outGaugePacket1 = to_JSON(packet)
    elif packet.ID[0] == 2:
        outGaugePacket2 = to_JSON(packet)

def outsim_packet(outsim, packet):
    global outSimPacket1
    global outSimPacket2
    
    if packet.ID[0] == 1:
        outSimPacket1 = to_JSON(packet)
    elif packet.ID[0] == 2:
        outSimPacket2 = to_JSON(packet)

def all(insim, packet):
    global insimQueue
    insimQueue.put(to_JSON(packet))

app = tornado.web.Application([(r'/racing', RacingWebSocket)])
app.listen(8080)

def outgauge_init():
    global insim
    while (running):
        insim = pyinsim.insim('192.168.1.10', 29999, Admin='')
        insim.bind(pyinsim.EVT_ALL, all)
        outsim = pyinsim.outsim('0.0.0.0', 10000, outsim_packet, 2.0)
        outgauge = pyinsim.outgauge('0.0.0.0', 10001, outgauge_packet, 2.0)

        pyinsim.run()
        print "Connection Closed, Retrying"

def tornado_init():
    tornado.ioloop.IOLoop.instance().start()

def lap_init():
    global insim
    while(running):
        try:
            time.sleep(1)
            insim.send(pyinsim.ISP_TINY, ReqI=255, SubT=pyinsim.TINY_SST)
            insim.send(pyinsim.ISP_TINY, ReqI=255, SubT=pyinsim.TINY_NLP)
        except:
            pass

outgauge_thread = Thread(target = outgauge_init)
tornado_thread = Thread(target = tornado_init)
lap_thread = Thread(target = lap_init)

outgauge_thread.start()
tornado_thread.start()
lap_thread.start()

def signal_handler(signal, frame):
        global running
        running = False
        pyinsim.closeall()
        tornado.ioloop.IOLoop.instance().stop()
        sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
print("Press Control-C to exit")
signal.pause()


