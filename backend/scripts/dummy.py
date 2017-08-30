# mongo_hello_world.py
# Author: Bruce Elgort
# Date: March 18, 2014
# Purpose: To demonstrate how to use Python to
# 1) Connect to a MongoDB document collection
# 2) Insert a document
# 3) Display all of the documents in a collection</code>
import datetime
import os
from StringIO import *
from bson.binary import Binary
from pymongo import MongoClient


connection = MongoClient('mongodb://localhost:27017/')

#jpgtxt = open('in.jpg','rb').read().encode('base64').replace('\n','')


db = connection.NDVI
Plants = db.plants
Images = db.images

plant =Plants.find_one()

if not plant is None:

    dir = os.path.dirname(__file__)
    imagePath = os.path.join(dir,'in.jpg')
    with open(imagePath, 'rb') as file2:
        image = {"plantId": plant['_id'],
            "contentType": "image/jpg",
            "data": Binary(file2.read()),
            "date": datetime.datetime.utcnow()}

    Images.insert_one(image)
else:
    print("no hay plantas definidas")
# close the connection to MongoDB
connection.close()  
