module.exports = mongoose => {
    var racerSchema = new mongoose.Schema({
        name: {
            type: String,
            default: 'Title'
        },
        age: {
            type: Number,
            default: 20
        },
        category: {
            type: mongoose.ObjectId,
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: {
            type: Date,
            default: Date.now
        }
    });
    var Racers = mongoose.model('Racers', racerSchema);
    return Racers;
};