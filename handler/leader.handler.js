/* eslint-disable */

const { firestore, bucket } = require('../config/config');
const path = require('path');
const fs = require('fs');


const collectionName = 'leaders';

const uploadImage = async (file) => {
    const { hapi: { filename }, _data } = file;
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
        resumable: false,
    });

    return new Promise((resolve, reject) => {
        blobStream
            .on('finish', () => {
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                resolve(publicUrl);
            })
            .on('error', (error) => {
                reject(`Unable to upload image, something went wrong: ${error.message}`);
            })
            .end(_data);
    });
};

// Handler untuk menambah leader
const addLeaderHandler = async (request, res) => {
    const { fullname, email, work_plan, position } = request.payload; // Menambahkan position ke payload
    const file = request.payload.image_profile;
    const id = nanoid(16);

    try {
        const imageUrl = await uploadImage(file);

        await firestore.collection(collectionName).doc(id).set({
            fullname,
            email,
            work_plan,
            position, // Menambahkan position ke dalam Firestore
            image_profile: imageUrl,
        });

        res.status(201).json({message: "successfully added leader", data});
        return response;
    } catch (error) {
        res.status(500).json({status: 'fail', message: `Leader gagal ditambahkan: ${error}`})
    }
};

// Handler untuk mendapatkan semua leader
const getAllLeadersHandler = async (request, res) => {
    try {
        const snapshot = await firestore.collection(collectionName).get();
        const leaders = [];

        snapshot.forEach((doc) => {
            leaders.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        res.status(200).json({message: 'success', data: leaders})
    } catch (error) {
        res.status(500).json({error: 'Gagal mengambil data leader', message: error.message})
    }
};

// Handler untuk mendapatkan leader berdasarkan ID
const getLeaderByIdHandler = async (request, res) => {
    const { id } = request.params;

    try {
        const doc = await firestore.collection(collectionName).doc(id).get();

        if (!doc.exists) {
            res.status(404).json({error: 'fail', message: 'Leader tidak ditemukan'})
        }

        res.status(200).json({message: 'success', data: doc.data()})
    } catch (error) {
        res.status(500).json({error: 'Gagal mengambil data leader', message: error.message})
    }
};

// Handler untuk mengubah leader berdasarkan ID
const editLeaderByIdHandler = async (request, res) => {
    const { id } = request.params;
    const { fullname, email, work_plan, position, image_profile } = request.payload; // Menambahkan position ke payload

    try {
        const doc = await firestore.collection(collectionName).doc(id);

        const leader = await doc.get();

        if (!leader.exists) {
            res.status(404).json({status: 'fail', message: 'Gagal memperbarui leader. Id tidak ditemukan'})
        }

        await doc.update({
            fullname,
            email,
            work_plan,
            position, // Menambahkan position ke dalam Firestore
            image_profile,
        });

        res.status(200).json({message: 'Leader berhasil diperbarui', status: 'success'})
    } catch (error) {
        res.status(500).json({message: 'Gagal memperbarui Leader', status: 'fail'})
    }
};

// Handler untuk menghapus leader berdasarkan ID
const deleteLeaderByIdHandler = async (request, h) => {
    const { id } = request.params;

    try {
        const doc = await firestore.collection(collectionName).doc(id);

        const leader = await doc.get();

        if (!leader.exists) {
            res.status(404).json({status: 'fail', message: 'Id not found'})
        }

        await doc.delete();

        res.status(200).json({status: 'success', message: 'Successfully removed leader'})
    } catch (error) {
        res.status(500).json({status: 'fail', message: 'Failed deleting leader'})
    }
};

module.exports = {
    addLeaderHandler,
    getAllLeadersHandler,
    getLeaderByIdHandler,
    editLeaderByIdHandler,
    deleteLeaderByIdHandler,
};