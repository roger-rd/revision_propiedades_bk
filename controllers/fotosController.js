const FotoModel = require('../models/fotosModel');
const cloudinary = require('../config/cloudinary');

// Helper: lee el flag desde ENV cada vez (por si cambias en Render)
const isCloudinaryDeleteEnabled = () =>
  String(process.env.CLOUDINARY_DELETE_ENABLED ?? 'true').toLowerCase() !== 'false';

async function subirFotoObservacion(req, res) {
    
    try {
        const { id_observacion, url_foto, id_public,id_empresa } = req.body;
        const nuevaFoto = await FotoModel.insertarFoto(id_observacion, url_foto, id_public,id_empresa);
        res.status(201).json(nuevaFoto);
  } catch (error) {
    console.error("Error al subir foto:", error.message);
    res.status(500).json({ error: 'Error al subir foto' });
  }
}

async function eliminarFotoObservacion(req, res) {
  const { id } = req.params;
  try {
    const foto = await FotoModel.obtenerFotoPorId(id);
    if (!foto) return res.status(404).json({ error: 'Foto no encontrada' });

    const canDelete = String(process.env.CLOUDINARY_DELETE_ENABLED ?? 'true').toLowerCase() !== 'false';

    if (foto.id_public && canDelete) {
      try {
        const resp = await cloudinary.uploader.destroy(foto.id_public, {
          invalidate: true,
          resource_type: 'image',
        });
        console.log('Cloudinary destroy =>', resp); // { result: 'ok' | 'not found' ... }
      } catch (e) {
        // ⚠️ Importante: NO interrumpir el flujo
        console.warn('Cloudinary destroy ERROR (continuo con BD):', e?.message || e);
      }
    }

    await FotoModel.eliminarFotoPorId(id);
    return res.json({ message: '✅ Foto eliminada', id });
  } catch (error) {
    console.error('Error eliminarFotoObservacion:', error);
    return res.status(500).json({ error: 'Error al eliminar foto' });
  }
}

async function subirFotoDesdeArchivo(req, res) {
  try {
    const { id_observacion } = req.body;
    const id_empresa = req.usuario?.id_empresa;

    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ninguna imagen' });
    }

    const url_foto = req.file.path;
    const id_public = req.file.filename; // Cloudinary lo devuelve como filename

    const nuevaFoto = await FotoModel.insertarFoto(id_observacion, url_foto, id_public, id_empresa);
    res.status(201).json(nuevaFoto);
  } catch (error) {
    console.error('❌ Error al subir foto desde archivo:', error);
    res.status(500).json({ error: 'Error al subir imagen' });
  }
}

async function eliminarFotoPorUrl(req, res) {
  try {
    const url_foto = req.body?.url_foto;
    if (!url_foto) return res.status(400).json({ error: 'Falta url_foto' });

    const foto = await FotoModel.obtenerFotoPorUrl(url_foto);
    if (!foto) {
      // No estaba en BD; respondemos OK para no trabar la UI
      return res.json({ message: '✅ Foto (por URL) ya no existía en BD', url_foto });
    }

    if (foto.id_public && isCloudinaryDeleteEnabled) {
      try {
        const resp = await cloudinary.uploader.destroy(foto.id_public, {
          invalidate: true,
          resource_type: 'image',
        });
        console.log('Cloudinary destroy (by url) =>', resp);
      } catch (e) {
        console.warn('Cloudinary destroy ERROR (by url, continuo):', e?.message || e);
      }
    }

    await FotoModel.eliminarFotoPorUrl(url_foto);
    return res.json({ message: '✅ Foto eliminada (por URL)', url_foto });
  } catch (e) {
    console.error('Error eliminarFotoPorUrl:', e);
    return res.status(500).json({ error: 'Error al eliminar foto' });
  }
}



module.exports = {
  subirFotoObservacion,
  eliminarFotoObservacion,
  subirFotoDesdeArchivo,
  eliminarFotoPorUrl
};
