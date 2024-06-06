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
const addLeaderHandler = async (request, h) => {
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

        const response = h.response({
            status: 'success',
            message: 'Leader berhasil ditambahkan',
            data: {
                leaderId: id,
            },
        });
        response.code(201);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: `Leader gagal ditambahkan: ${error}`,
        });
        response.code(500);
        return response;
    }
};

// Handler untuk mendapatkan semua leader
const getAllLeadersHandler = async (request, h) => {
    try {
        const snapshot = await firestore.collection(collectionName).get();
        const leaders = [];

        snapshot.forEach((doc) => {
            leaders.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        const response = h.response({
            status: 'success',
            data: {
                leaders,
            },
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal mengambil data leader',
        });
        response.code(500);
        return response;
    }
};

// Handler untuk mendapatkan leader berdasarkan ID
const getLeaderByIdHandler = async (request, h) => {
    const { id } = request.params;

    try {
        const doc = await firestore.collection(collectionName).doc(id).get();

        if (!doc.exists) {
            const response = h.response({
                status: 'fail',
                message: 'Leader tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        const response = h.response({
            status: 'success',
            data: {
                leader: doc.data(),
            },
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal mengambil data leader',
        });
        response.code(500);
        return response;
    }
};

// Handler untuk mengubah leader berdasarkan ID
const editLeaderByIdHandler = async (request, h) => {
    const { id } = request.params;
    const { fullname, email, work_plan, position, image_profile } = request.payload; // Menambahkan position ke payload

    try {
        const doc = await firestore.collection(collectionName).doc(id);

        const leader = await doc.get();

        if (!leader.exists) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal memperbarui leader. Id tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        await doc.update({
            fullname,
            email,
            work_plan,
            position, // Menambahkan position ke dalam Firestore
            image_profile,
        });

        const response = h.response({
            status: 'success',
            message: 'Leader berhasil diperbarui',
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui leader',
        });
        response.code(500);
        return response;
    }
};

// Handler untuk menghapus leader berdasarkan ID
const deleteLeaderByIdHandler = async (request, h) => {
    const { id } = request.params;

    try {
        const doc = await firestore.collection(collectionName).doc(id);

        const leader = await doc.get();

        if (!leader.exists) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal menghapus leader. Id tidak ditemukan',
            });
            response.code(404);
            return response;
        }

        await doc.delete();

        const response = h.response({
            status: 'success',
            message: 'Leader berhasil dihapus',
        });
        response.code(200);
        return response;
    } catch (error) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menghapus leader',
        });
        response.code(500);
        return response;
    }
};

module.exports = {
    addLeaderHandler,
    getAllLeadersHandler,
    getLeaderByIdHandler,
    editLeaderByIdHandler,
    deleteLeaderByIdHandler,
};
