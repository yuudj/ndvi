const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// begin schema
var plantSchema = new mongoose.Schema({
    icon: String,
    displayName: String,
    notes: [{
        body: String,
        date: { type: Date, default: Date.now },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    }],
    schedule: {
        isEnabled: Boolean,
        cron: String,
        script: String
    }
});

mongoose.model('Plants', plantSchema);


var imagesSchema = new mongoose.Schema({
    plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plants' },
    date: { type: Date, default: Date.now },
    data: Buffer,
    contentType: String
}, { capped: 1000000000 });

mongoose.model('Images', imagesSchema);
