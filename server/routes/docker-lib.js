const util = require('util');
const exec = require('child-process-promise').exec;
var Promise = require("bluebird");
const uuidv1 = require('uuid/v1');
global.Promise = Promise;

function downloadImage(image, tag, id) {

    // check if image name includes '/' character
    if (String(image).includes('/')) {
        var dir = String(image).replace('/', '_') + '_' + tag;
    } else {
        var dir = image + '_' + tag;
    }


    var download_command = './image-downloader.sh ' + dir + ' ' + image + ':' + tag;
    var compress_command = 'tar -C ./' + dir + ' -cvf ' + dir + '.tar ./';
    var upload_command = './dropbox_uploader.sh upload ' + dir + '.tar' + ' /vps';
    var delete_dir_command = 'rm -r ' + dir;
    var delete_file_command = 'rm ' + dir + '.tar';

    return new Promise(function (resolve, reject) {
        console.log('starting download ...');
        downloadImageLayer()
            .stderr.on('data', (error) => {
                reject(error);
            }).on('close', (code) => {
                console.log('download complete successfully');
                if (code == 0) {
                    compressImageLayers()
                        .stderr.on('data', (error) => {
                            reject(error);
                        }).on('close', (code) => {
                            console.log('compressing complete successfully');
                            if (code == 0) {
                                uploadImage()
                                    .stderr.on('data', (error) => {
                                        reject(error);
                                    }).on('close', (code) => {
                                        if (code == 0) {
                                            console.log('uploading complete successfully');
                                            deleteTempDir()
                                                .stderr.on('data', (error) => {
                                                    reject(error);
                                                }).on('close', (code) => {
                                                    if (code == 0) {
                                                        console.log('deleting temp dir complete successfully');
                                                        deleteTempFile()
                                                            .stderr.on('data', (error) => {
                                                                reject(error);
                                                            }).on('close', (code) => {
                                                                console.log('deleting temp file complete successfully');
                                                                if (code == 0) resolve(id);
                                                                else reject(code);
                                                            });
                                                    }
                                                    else reject(code);
                                                });
                                        }
                                        else reject(code);
                                    });
                            }
                            else reject(code);
                        });
                }
                else reject(code);
            });
    });
}

function downloadImageLayer(download_command) {
    const spa = spawn(download_command);
    return spa;
}

function compressImageLayers(compress_command) {
    const spa = spawn(compress_command);
    return spa;
}

function uploadImage(upload_command) {
    const spa = spawn(upload_command);
    return spa;
}

function deleteTempDir(delete_dir_command) {
    const spa = spawn(delete_dir_command);
    return spa;
}

function deleteTempFile(delete_file_command) {
    const spa = spawn(delete_file_command);
    return spa;
}

module.exports = {
    downloadImage: downloadImage
}
