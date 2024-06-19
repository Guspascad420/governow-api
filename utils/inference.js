const tf = require('@tensorflow/tfjs-node')
const use = require('@tensorflow-models/universal-sentence-encoder');
require('dotenv').config()

async function loadModel() {
    return tf.loadGraphModel(process.env.MODEL_URL);
}

async function predictClassification(text) {
    const classes = ['infrastruktur', 'kesehatan', 'keamanan', 'edukasi']
    const model = await loadModel()
    const tokenizer = await use.loadTokenizer('https://storage.googleapis.com/governow/model/tokenizer_dictionary.json')
    const embedder = await use.load()
    let newText = tokenizer.encode(text)
    newText = embedder.embed(newText)
    pred_t = model.predict(newText)

    return classes[pred_t.argmax()]
}

module.exports = predictClassification

