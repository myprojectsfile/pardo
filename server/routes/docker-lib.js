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

    console.log('(0) ---> printing commands <-----')
    console.log(download_command);
    console.log(compress_command);
    console.log(upload_command);
    console.log(delete_dir_command);
    console.log(delete_file_command);

    return new Promise(function (resolve, reject) {
        // 1- download image layers
        console.log('(1) ---> downloading:' + dir);

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
    return new Promise((resolve, reject) => {
        const spa = spawn(download_command);

        spa.stdout.on('data', (data) => {
        });

        spa.stderr.on('data', (error) => {
            reject(error);
        });

        spa.on('close', (code) => {
            if (code == 0) resolve(code);
            else reject(code);
        });
    })
}

function compressImageLayers(compress_command) {
    return new Promise((resolve, reject) => {
        const spa = spawn(compress_command);

        spa.stdout.on('data', (data) => {
        });

        spa.stderr.on('data', (error) => {
            reject(error);
        });

        spa.on('close', (code) => {
            if (code == 0) resolve(code);
            else reject(code);
        });
    })
}

function uploadImage(upload_command) {
    return new Promise((resolve, reject) => {
        const spa = spawn(upload_command);

        spa.stdout.on('data', (data) => {
        });

        spa.stderr.on('data', (error) => {
            reject(error);
        });

        spa.on('close', (code) => {
            if (code == 0) resolve(code);
            else reject(code);
        });
    })
}

function deleteTempDir(delete_dir_command) {
    return new Promise((resolve, reject) => {
        const spa = spawn(delete_dir_command);

        spa.stdout.on('data', (data) => {
        });

        spa.stderr.on('data', (error) => {
            reject(error);
        });

        spa.on('close', (code) => {
            if (code == 0) resolve(code);
            else reject(code);
        });
    })
}

function deleteTempFile(delete_file_command) {
    return new Promise((resolve, reject) => {
        const spa = spawn(delete_file_command);

        spa.stdout.on('data', (data) => {
        });

        spa.stderr.on('data', (error) => {
            reject(error);
        });

        spa.on('close', (code) => {
            if (code == 0) resolve(code);
            else reject(code);
        });
    })
}




// function compressImageLayers(compress_command) {
//     return exec(compress_command)
//         .then(() => { console.log('(2) -----> compressing dir completed successfully') })
//         .catch((error) => {
//             console.log(`(2) ######## compressing error ---->:${error}`);
//         });
// }

// function uploadImage(upload_command) {
//     return exec(upload_command)
//         .then(() => { console.log('(3) -----> uploading file completed successfully') })
//         .catch((error) => {
//             console.log(`(3) ######## uploading error ---->:${error}`);
//         });
// }

// function deleteTempDir(delete_dir_command) {
//     return exec(delete_dir_command)
//         .then(() => { console.log('(4) -----> deleting dir completed successfully') })
//         .catch((error) => {
//             console.log(`(4) ######## deleting dir error ---->:${error}`);
//         });
// }

// function deleteTempFile(delete_file_command) {
//     return exec(delete_file_command)
//         .then(() => { console.log('(5) -----> deleting file completed successfully') })
//         .catch((error) => {
//             console.log(`(5) ######## deleting file error ---->:${error}`);
//         });
// }

module.exports = {
    downloadImage: downloadImage
}
