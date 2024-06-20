'use strict'
const {Storage} = require('@google-cloud/storage')
const dateFormat = require('dateformat')

// TODO: Sesuaikan konfigurasi Storage
const gcs = new Storage()

// TODO: Tambahkan nama bucket yang digunakan
const bucketName = 'governow'
const bucket = gcs.bucket(bucketName)

function getPublicUrl(filename) {
    return 'https://storage.googleapis.com/' + bucketName + '/' + filename;
}

let ImgUpload = {}

ImgUpload.uploadToGcs = (req, res, next) => {
    if (!req.file) return next()

    const gcsname = dateFormat(new Date(), "yyyymmdd-HHMMss")
    const file = bucket.file(gcsname)

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    })

    stream.on('error', (err) => {
        req.file.cloudStorageError = err
        next(err)
    })

    stream.on('finish', () => {
        req.file.cloudStorageObject = gcsname
        req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
        bucket.file(gcsname).makePublic().then(_ => {
           next()
        })
    })

    stream.end(req.file.buffer)
}

module.exports = ImgUpload
