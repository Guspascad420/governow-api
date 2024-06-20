const tf = require('@tensorflow/tfjs-node')
require('dotenv').config()

async function loadModel() {
    return tf.loadLayersModel(process.env.MODEL_URL);
}

async function preprocessText(text) {
    const result = await fetch('https://storage.googleapis.com/governow/tokenizer_dictionary2.json')
    const word2Index = await result.json()
    const textArr = text.replace(/-/g, ' ').replace(/[^\w\s]/gi, '').toLowerCase().split(" ")
    // console.log(textArr)
    let sequence = [[]]
    textArr.forEach(word => {
        sequence[0].push(word2Index[word])
    })
    sequence = padSequences(sequence, 100)
    return sequence
}

async function predictClassification(text) {
    const classes = ['edukasi', 'infrastruktur', 'keamanan', 'kesehatan']
    const model = await loadModel()
    const preprocessedText = await preprocessText(text)
    const predTensor = model.predict(tf.tensor2d(preprocessedText, [preprocessedText.length, 100]))
    const predTensorArray = await predTensor.array()

    const predictedClassIndex = predTensorArray.map(pred => pred.indexOf(Math.max(...pred)))
    return classes[predictedClassIndex]
}

function padSequences(sequences, maxLen, padding = 'post', truncating = 'post', padValue = 0) {
    return sequences.map(seq => {
        if (seq.length > maxLen) {
            // Truncate sequence
            if (truncating === 'pre') {
                seq = seq.slice(seq.length - maxLen);
            } else { // truncating === 'post'
                seq = seq.slice(0, maxLen);
            }
        } else if (seq.length < maxLen) {
            // Pad sequence
            if (padding === 'pre') {
                seq = Array(maxLen - seq.length).fill(padValue).concat(seq);
            } else { // padding === 'post'
                seq = seq.concat(Array(maxLen - seq.length).fill(padValue));
            }
        }
        return seq;
    });
}

module.exports = predictClassification