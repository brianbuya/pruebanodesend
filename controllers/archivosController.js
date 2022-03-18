const shortid = require('shortid');
const fs = require('fs');
// Subida de archivos
const multer = require('multer');
const Enlaces = require('../models/Enlace');

exports.subirArchivo = async (req, res, next) => {
    const configuracionMulter = {

        limits: { fileSize : req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb( null, __dirname+'/../uploads' )
            },
            filename: (req, file, cb) => {
                //const extension = file.mimetype.split('/')[1];
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb( null, `${shortid.generate()}${extension}` );
            }
        })
    }
    
    const upload = multer(configuracionMulter).single('archivo');

    upload( req, res, async (error) => {
        console.log(req.file);

        if(!error) {
            res.json({archivo: req.file.filename});
        } else {
            console.log(error);
            return next();
        }
    });
    
}

exports.eliminarArchivo = async (req, res) => {
    console.log(req.archivo);

    try {
       fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`);
       console.log('archivo eliminado');
    } catch (error) {
        console.log(error);
    }
}

// Descarga un archivo
exports.descargar = async (req, res, next) => {

    // Obtiene el enlace
    const { archivo } = req.params;
    const enlace = await Enlaces.findOne({ nombre: archivo });

    const archivoDescarga = __dirname + '/../uploads/' + archivo;
    //console.log(req.params.archivo)
    res.download(archivoDescarga);

    // Eliminar el archivo y la entrada de la BD
    // Si las descargas son iguales 1 - borrar la entrar y archivo
    const { descargar, nombre } = enlace;

    if(descargar === 1) {
        //console.log('Si solo 1')

        // Eliminar el archivo
        req.archivo = nombre;

        // eliminar la entrada de la db
        await Enlaces.findOneAndRemove(enlace.id);

        next()
    } else {
        // Si las descargas son mayores a 1, restamos descarga, de 20 a 19 por ej
        enlace.descargar--;
        await enlace.save();
        //console.log('aun hay descargas')
    }

}