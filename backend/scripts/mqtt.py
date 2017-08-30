import cv2
import sys
import base64
import paho.mqtt.client as mqtt
from Crypto import Random
from Crypto.Cipher import AES

baseTopic="DAF4-48A8-"

def encrypt_node(data, key='8'*32, iv='8'*16):
    aes = AES.new(key, AES.MODE_CBC, iv)
    return aes.encrypt(pad(data)).encode('hex')

def capture(client):
    # video on
    video_capture = cv2.VideoCapture(0)
    # tree images
    for x in range(0, 3):
        # Capture frame-by-frame
        ret, frame = video_capture.read()
        cnt = cv2.imencode('.jpg',frame)[1]
        client.publish(baseTopic + "/data", base64.encodestring(cnt))
    # When everything is done, release the capture
    video_capture.release()

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe(baseTopic + "/cmd/#")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    capture(client)
    print(msg.topic+" "+str(msg.payload))

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("iot.eclipse.org", 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()


