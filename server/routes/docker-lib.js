const util = require('util');
const exec = require('child-process-promise').exec;
var Promise = require("bluebird");
const uuidv1 = require('uuid/v1');
global.Promise = Promise;

function downloadImage(image, tag, id) {
    var dir = image + '_' + tag;

    var download_command = './image-downloader.sh ' + dir + ' ' + image + ':' + tag;
    var compress_command = 'tar -C ./' + dir + ' -cvf ' + dir + '.tar ./';
    var upload_command = './dropbox_uploader.sh upload ' + dir + '.tar' + ' /vps';
    var delete_dir_command = 'rm -r ' + dir;
    var delete_file_command = 'rm ' + dir + '.tar';

    return new Promise(function (resolve, reject) {
        // 1- download image layers
        console.log('downloading:' + dir);

        downloadImageLayer(download_command)
            .then(() => {
                // 2- compress image layers
                console.log('compressing:' + dir);

                compressImageLayers(compress_command)
                    .then(() => {
                        // 3- upload image file
                        console.log('uploading:' + dir);

                        uploadImage(upload_command)
                            .then(() => {
                                // 4- delete temp directory
                                console.log('deleting directory:' + dir);

                                deleteTempDir(delete_dir_command)
                                    .then(() => {
                                        // 5- delete temp file
                                        console.log('deleting file:' + dir);

                                        downloadImageLayer(delete_file_command)
                                            .then(() => {
                                                resolve(id);
                                            })
                                            .catch((error) => {
                                                reject(error);
                                            });
                                    })
                                    .catch((error) => {
                                        reject(error);
                                    });
                            })
                            .catch((error) => {
                                reject(error);
                            });
                    })
                    .catch((error) => {
                        reject(error);
                    });
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function downloadImageLayer(download_command) {
    return exec(download_command)
        .then()
        .catch((error) => {
        });
}

function compressImageLayers(compress_command) {
    return exec(compress_command).then()
        .catch((error) => {
        });
}

function uploadImage(upload_command) {
    return exec(upload_command).then()
        .catch((error) => {
        });
}

function deleteTempDir(delete_dir_command) {
    return exec(delete_dir_command).then()
        .catch((error) => {
        });
}

function deleteTempFile(delete_file_command) {
    return exec(delete_file_command).then()
        .catch((error) => {
        });
}

module.exports = {
    downloadImage: downloadImage
}
