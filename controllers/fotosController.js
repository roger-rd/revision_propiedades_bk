const FotoModel = require('../models/fotosModel');
const { v2: cloudinary } = require('cloudinary');

/* === Helpers === */

// lee el flag en runtime (por si lo cambias en Render)
const isCloudinaryDeleteEnabled = () =>
  String(process.env.CLOUDINARY_DELETE_ENABLED ?? 'true').toLowerCase() !== 'false';

// Deriva public_id desde la secure_url (soporta vNNN y transformaciones previas)
function publicIdFromUrl(url) {
  try {
    const u = new URL(url);
    const p = u.pathname;                            // /image/upload/.../vNNN/folder/file.ext
    const idx = p.indexOf('/upload/');
    if (idx === -1) return null;

    const rest = p.slice(idx + '/upload/'.length);
    const segs = rest.split('/').filter(Boolean);

    // quitar transformaciones y versión vNNN
    let versionIdx = -1;
    for (let i = 0; i < segs.length; i++) if (/^v\d+$/.test(segs[i])) versionIdx = i;
    const after = versionIdx >= 0 ? segs.slice(versionIdx + 1) : segs;
    if (!after.length) return null;

    const file = after.pop();
    if (!file) return null;
    const nameNoExt = file.replace(/\.[^.]+$/, '');
    const folder = after.join('/');

    return folder ? `${folder}/${nameNoExt}` : nameNoExt;
  } catch {
    return null;
  }
}

// Genera candidatos con/sin prefijo "revision-casa/"
function makeCandidates({ fromDb, fromUrl }) {
  const set = new Set();
  const add = (v) => { if (v && typeof v === 'string') set.add(v); };

  add(fromDb);
  add(fromUrl);

  const variants = (pid) => {
    if (!pid) return;
    add(pid);
    if (!pid.startsWith('revision-casa/')) add(`revision-casa/${pid}`);
    if (pid.startsWith('revision-casa/')) add(pid.replace(/^revision-casa\//, ''));
  };

  variants(fromDb);
  variants(fromUrl);

  return Array.from(set);
}

// Intenta destruir el primer public_id válido. No rompe si falla.
async function destroyFirstMatch(publicIds) {
  for (const pid of publicIds) {
    try {
      const resp = await cloudinary.uploader.destroy(pid, {
        resource_type: 'image',
        invalidate: true,
      });
      console.log('TRY destroy =>', { pid, result: resp?.result });
      if (resp?.result === 'ok' || resp?.result === 'deleted') return true;
    } catch (e) {
      console.warn('Destroy error =>', pid, e?.message || e);
    }
  }
  return false;
}

/* === Subidas === */

async function subirFotoObservacion(req, res) {
  try {
    const { id_observacion, url_foto, id_public, id_empresa } = req.body;
    const nueva = await FotoModel.insertarFoto(id_observacion, url_foto, id_public, id_empresa);
    res.status(201).json(nueva);
  } catch (error) {
    console.error('Error al subir foto:', error);
    res.status(500).json({ error: 'Error al subir foto' });
  }
}

// via multer-storage-cloudinary
async function subirFotoDesdeArchivo(req, res) {
  try {
    const { id_observacion } = req.body;
    const id_empresa = req.usuario?.id_empresa;

    if (!req.file) return res.status(400).json({ error: 'No se recibió ninguna imagen' });

    const url_foto = req.file.path;      // secure_url
    const id_public = req.file.filename; // public_id COMPLETO

    const nueva = await FotoModel.insertarFoto(id_observacion, url_foto, id_public, id_empresa);
    res.status(201).json(nueva);
  } catch (error) {
    console.error('❌ Error al subir foto desde archivo:', error);
    res.status(500).json({ error: 'Error al subir imagen' });
  }
}

/* === Borrados === */

// DELETE /api/fotos-observacion/:id
async function eliminarFotoObservacion(req, res) {
  const { id } = req.params;
  try {
    const foto = await FotoModel.obtenerFotoPorId(id); // incluye url_foto
    if (!foto) return res.status(404).json({ error: 'Foto no encontrada' });

    // Logs de diagnóstico (sin llamar cloudinary.config())
    console.log('CLD cloud:', process.env.CLOUDINARY_NAME);
    console.log('DELETE by id =>', { id_public_db: foto.id_public, url_foto_db: foto.url_foto });

    if (isCloudinaryDeleteEnabled()) {
      const candidates = makeCandidates({
        fromDb: foto.id_public,
        fromUrl: publicIdFromUrl(foto.url_foto),
      });
      console.log('CANDIDATES =>', candidates);
      await destroyFirstMatch(candidates);
    }

    await FotoModel.eliminarFotoPorId(id);
    return res.json({ message: '✅ Foto eliminada', id });
  } catch (error) {
    console.error('Error eliminarFotoObservacion:', error);
    return res.status(500).json({ error: 'Error al eliminar foto' });
  }
}

// DELETE /api/fotos-observacion/by-url  (body: { url_foto })
async function eliminarFotoPorUrl(req, res) {
  try {
    const url_foto = req.body?.url_foto;
    if (!url_foto) return res.status(400).json({ error: 'Falta url_foto' });

    const fila = await FotoModel.obtenerFotoPorUrl(url_foto); // id, id_public
    console.log('CLD cloud:', process.env.CLOUDINARY_NAME);
    console.log('DELETE by url =>', { url_foto });

    if (isCloudinaryDeleteEnabled()) {
      const fromUrl = publicIdFromUrl(url_foto);
      const candidates = makeCandidates({
        fromDb: fila?.id_public,
        fromUrl,
      });
      console.log('CANDIDATES(by-url) =>', candidates);
      await destroyFirstMatch(candidates);
    }

    if (fila) {
      await FotoModel.eliminarFotoPorUrl(url_foto);
      return res.json({ message: '✅ Foto eliminada (BD + Cloudinary)', via: 'by-url', url_foto });
    } else {
      return res.json({ message: '✅ Foto eliminada (solo Cloudinary)', via: 'by-url', url_foto });
    }
  } catch (e) {
    console.error('Error eliminarFotoPorUrl:', e);
    return res.status(500).json({ error: 'Error al eliminar foto' });
  }
}

module.exports = {
  subirFotoObservacion,
  subirFotoDesdeArchivo,
  eliminarFotoObservacion,
  eliminarFotoPorUrl,
};
