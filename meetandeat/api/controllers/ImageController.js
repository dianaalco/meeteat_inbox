/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req, res, next) {
        Image.find(function foundImages(err, images) {
            if (err) return next(err);
            res.view({
                images: images
            });
        });
    },
    show: function(req, res, next) {
        Image.findOne(req.param('id'))
            .populate('subtitulo_de_imagen')
            .exec(function(err,file) {
                res.view({
                    subtitles: image.subtitulo_de_imagen,
                    image: image
                });
            });
    },
    destroy: function(req, res, next) {
        Image.findOne(req.param('id'), function foundImage(err, image) {
            if (err) return next(err);
            if (!image) return next('Image doesn\'t exist.');
            var pathToRemove = image.fullPath;
            Image.destroy(req.param('id'), function imageDestroyed(err) {
                if (err) return next(err);
                var fs = require('fs');
                var readRemoveImage = require('read-remove-image');
                readRemoveImage(pathToRemove, function(err, buf) {
                    if (err) return next(err);
                    buf;
                    fs.existsSync(pathToRemove); //=> false 
                    return res.redirect('/image/');
                });
            });
        });
    },
    'upload-image' :function (req,res) {
        res.view();
    },
    getImage: function (req, res) {
        var query = {name: req.param('name')};
        if (req.param('version'))
            query = {name: req.param('imageName'), version: req.param('version')};

            Image.findOne({where : query, sort: 'version DESC'}).exec(function(err, userImage) {
                if (err) {     
                    console.log("Error: " + err);
                    res.json(err);
                    return;
                }
                else if (userImage) {   
                    console.log("userImage: " + userImage);
                    console.log("userImage name: " + userImage.name);
                    res.download(userImage.fullPath, userImage.name);
                }
                else
                    res.json("userImage not found!");
            });
    },
    upload: function  (req, res) {
        if(req.method === 'GET')
            return res.json({'status':'GET not allowed'});
            // Call to /upload via GET is error
            var upImage = req.image('upImage');
            var path = './tempd/user/images/';
            var mkdirp = require('mkdirp');
            mkdirp(path, function(err) { 
                if (err) {
                    console.log("Image folder not created: ", err);
                    return res.serverError(err);
                }
                console.log("Image folder created or existed!")
                          
                upImage.upload({maxBytes: 1000000000, dirname: path },function onUploadComplete (err, images) {                                                                                                      
                    if (err) {
                        console.log("Image file not uploaded. Error: "+err);
                        return res.serverError(err);
                    }
                    else {
                        var imagePath = images[0].fd;
                        var imageSize = images[0].size;
                        var imageType = images[0].type;
                        var imageName = images[0].imagename;

                        Image.create({name: imageName,
                            version: 0,
                            description: imageType,
                            image: imageName,
                            imageSize: imageSize,
                            fullPath: imagePath}, function Done(err) {
                                res.redirect('image/index/');
                            }
                        );
                    }
                });
            });
    }
	
};

