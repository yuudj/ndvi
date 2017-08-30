const mongoose = require('mongoose');
const materializedPlugin = require('mongoose-materialized');
const Schema = mongoose.Schema;

// begin schema
var PartitionSchema = new Schema({
    icon: String,
    displayName: String
});
PartitionSchema.plugin(materializedPlugin, { separator: '/' });
mongoose.model('Partitions', PartitionSchema);


var PlantSchema = new mongoose.Schema({
    icon: String,
    displayName: String,
    partition_id:{ type: Schema.Types.ObjectId, ref: 'Partitions' },
    schedule: {
        isEnabled: Boolean,
        cron: String,
        script: String
    }
});
mongoose.model('Plants', PlantSchema);


var CameraSchema = new mongoose.Schema({
    icon: String,
    displayName: String,
    partition_id:{ type: Schema.Types.ObjectId, ref: 'Plants' },
    mqtt_topic: String
});
mongoose.model('Cameras', CameraSchema);


var ImagesSchema = new Schema({
    camera_id: { type: Schema.Types.ObjectId, ref: 'Cameras' },
    date: { type: Date, default: Date.now },
    data: Buffer,
    contentType: String
}, { capped: 1000000000 });
mongoose.model('Images', ImagesSchema);
