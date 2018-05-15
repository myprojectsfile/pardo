var express = require('express');
var router = express.Router();
var docker = require('./docker-lib');
var Promise = require("bluebird");
const uuidv1 = require('uuid/v1');
var Queue = require('bull');
var _ = require('lodash');
global.Promise = Promise;
var maxConcurrent = 1;
var maxQueue = Infinity;
var server = require('../../server.js');

var dockerDownQueue = new Queue('docker_download_queue');

var jobArray = [];

dockerDownQueue.process(function (job) {
    return docker.downloadImage(job.data.image, job.data.tag, job.opts.jobId);

    return Promise.reject(new Error(`error in dwonloaing docker image with jobId:${job.opts.jobId}`));
    return Promise.resolve({ jobId: job.opts.id });
});

/* GET api listing. */
router.get('/', (req, res) => {
    res.status(200).send('this is docker api get method.');
});


router.post('/downloadImage', function (req, res) {
    // generate taksId;
    var _jobId = uuidv1();
    var _image = req.body.image;
    var _tag = req.body.tag;

    // add image to download queue
    dockerDownQueue.add({ image: _image, tag: _tag }, { jobId: _jobId })
        .then(
            (job) => {
                console.log(`+++++ Added +++++ downloimageNamead job with id ${job.opts.jobId} added to queue Successfully.`);
                jobArray.push({ jobId: _jobId, imageName: _image + ':' + _tag, state: 'waiting' });
                server.emmitToClient('docker-queue-changed', jobArray);
                console.log('----------> job Array is:' + JSON.stringify(jobArray));
                res.status(200).send();
            })
        .catch(
            (error) => {
                console.log('error message:' + error);
            });
});

dockerDownQueue.on('active', function (job, jobPromise) {
    updateJobItemState(job.id, 'downloading');
    server.emmitToClient('docker-queue-changed', jobArray);
    console.log('----------> job Array is:' + JSON.stringify(jobArray));
    console.log(`<<<<< Started >>>>> the download job with id ${job.opts.jobId} is started`);
})

dockerDownQueue.on('completed', function (job, jobPromise) {
    updateJobItemState(job.id, 'completed');
    server.emmitToClient('docker-queue-changed', jobArray);
    console.log('----------> job Array is:' + JSON.stringify(jobArray));
    console.log(`>>>>> Completed <<<<< the download job with id ${job.opts.jobId} is completed`);
})

function refreshJobArray() {
    return new Promise((resolve, reject) => {
        dockerDownQueue.getCompleted().then((completed_jobs) => {
            completedJobs = completed_jobs;
            dockerDownQueue.getActive().then((active_jobs) => {
                activeJobs = active_jobs;
                dockerDownQueue.getWaiting().then((waiting_jobs) => {
                    waitingJobs = waiting_jobs;
                    jobArray = completedJobs.concat(activeJobs).concat(waitingJobs);
                    resolve(jobArray);
                });
            })
        });
    });
};

function updateJobItemState(_jobId, _newState) {
    var jobArrayIndex = _.findIndex(jobArray, { jobId: _jobId });
    var currentJobItem = jobArray[jobArrayIndex];
    jobArray.splice(jobArrayIndex, 1, { jobId: currentJobItem.jobId, imageName: currentJobItem.imageName, state: _newState });
}

module.exports = {
    router: router,
    jobArray: jobArray
};
